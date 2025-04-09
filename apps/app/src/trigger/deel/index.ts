import { db } from "@comp/db";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import axios from "axios";
import { z } from "zod";
import { Departments } from "@comp/db/types";
import { decrypt } from "@/lib/encryption";
import { completeEmployeeCreation } from "@/lib/db/employee";

const deelTaskSchema = z.object({
	integration: z.object({
		id: z.string(),
		name: z.string(),
		integration_id: z.enum(["deel"]),
		settings: z.record(z.any()),
		user_settings: z.record(z.any()),
		organization: z.object({
			id: z.string(),
			name: z.string(),
		}),
	}),
});

interface DeelEmployee {
	id: string;
	created_at: string;
	first_name: string;
	last_name: string;
	full_name: string;
	preferred_first_name: string | null;
	preferred_last_name: string | null;
	worker_id: string;
	external_id: string | null;
	termination_last_day: string | null;
	emails: {
		type: string;
		value: string | null;
	}[];
	birth_date: string;
	start_date: string;
	nationalities: string[];
	client_legal_entity: {
		id: string;
		name: string;
	};
	state: string | null;
	seniority: string;
	completion_date: string | null;
	direct_manager: {
		id: string;
		first_name: string;
		last_name: string;
		preferred_first_name: string | null;
		preferred_last_name: string | null;
		display_name: string;
		work_email: string;
		worker_id: number;
		external_id: string | null;
	} | null;
	direct_reports: any | null;
	direct_reports_count: number;
	employments: {
		id: string;
		name: string;
		team: {
			id: string;
			name: string;
		};
		email: string;
		state: string | null;
		country: string;
		payment: {
			rate: number;
			scale: string;
			contract_name: string;
			currency: string;
		};
		is_ended: boolean;
		termination_last_day: string | null;
		timezone: string;
		job_title: string;
		seniority: string;
		start_date: string;
		work_email: string | null;
		hiring_type: string;
		hiring_status: string;
		completion_date: string | null;
		contract_status: string;
		voluntarily_left: boolean;
		contract_coverage: string | null;
		new_hiring_status: string;
		client_legal_entity: {
			id: string;
			name: string;
		};
		has_eor_termination: boolean;
		contract_is_archived: boolean;
		contract_has_contractor: boolean;
		is_user_contract_deleted: boolean;
		hris_direct_employee_invitation: string | null;
		currency: string;
	}[];
	hiring_status: string;
	new_hiring_status: string;
	hiring_type: string;
	job_title: string;
	country: string;
	timezone: string;
	department: Record<string, any>;
	work_location: string | null;
	updated_at: string;
	addresses: {
		streetAddress: string;
		locality: string;
		region: string;
		postalCode: string;
		country: string;
	}[];
}

/**
 * Fetches employees from Deel API
 */
async function fetchDeelEmployees(
	accessToken: string,
): Promise<DeelEmployee[]> {
	try {
		const response = await axios.get(
			"https://api.letsdeel.com/rest/v2/people",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			},
		);

		const body = response.data;

		logger.info(`Response: ${JSON.stringify(body, null, 2)}`);

		// Return the employees from the response
		return body.data;
	} catch (error) {
		logger.error(`Failed to fetch employees from Deel: ${error}`);
		throw error;
	}
}

/**
 * Maps Deel department to our system's department enum
 */
function mapDeelDepartment(deelDepartment?: string): Departments {
	if (!deelDepartment) return Departments.none;

	// Map Deel departments to our system's department enum
	const departmentMap: Record<string, Departments> = {
		Engineering: Departments.it,
		Product: Departments.it,
		Marketing: Departments.admin,
		Sales: Departments.admin,
		HR: Departments.hr,
		Finance: Departments.admin,
		Legal: Departments.gov,
		Operations: Departments.admin,
		// Add more mappings as needed
	};

	return departmentMap[deelDepartment] || Departments.none;
}

/**
 * Task to sync employees from Deel to our system
 */
export const syncDeelEmployees = schemaTask({
	id: "sync-deel-employees",
	schema: deelTaskSchema,
	maxDuration: 1000 * 60 * 10, // 10 minutes
	run: async ({ integration }) => {
		logger.info(`Running Deel employee sync for ${integration.name}`);

		try {
			// Check if the integration is for Deel
			if (integration.integration_id !== "deel") {
				logger.warn(
					`Integration ${integration.name} is not a Deel integration`,
				);
				return { success: false, error: "Not a Deel integration" };
			}

			// Extract access token from user settings
			let accessToken: string | undefined;
			try {
				if (
					integration.user_settings.api_key &&
					typeof integration.user_settings.api_key === "object" &&
					"encrypted" in integration.user_settings.api_key
				) {
					// Decrypt the access token
					try {
						accessToken = await decrypt(integration.user_settings.api_key);
						logger.info("Successfully decrypted Deel API key");
					} catch (decryptError) {
						logger.error(`Failed to decrypt Deel API key: ${decryptError}`);

						// Check if SECRET_KEY is set
						if (!process.env.SECRET_KEY) {
							return {
								success: false,
								error:
									"Missing SECRET_KEY environment variable required for decryption",
							};
						}

						return {
							success: false,
							error:
								"Failed to decrypt API key. Make sure SECRET_KEY is correct.",
						};
					}
				} else {
					// For backward compatibility, in case it's stored as a plain string
					accessToken = integration.user_settings.api_key;
				}

				if (!accessToken) {
					logger.error(
						`Deel integration ${integration.name} is missing an access token`,
					);
					return { success: false, error: "Missing access token" };
				}
			} catch (error) {
				logger.error(
					`Failed to decrypt access token for Deel integration ${integration.name}: ${error}`,
				);
				return { success: false, error: "Failed to decrypt access token" };
			}

			// Fetch employees from Deel
			logger.info("Attempting to fetch employees from Deel API...");
			const deelEmployees = await fetchDeelEmployees(accessToken);
			logger.info(`Fetched ${deelEmployees.length} employees from Deel`);
			logger.info(`Employees: ${JSON.stringify(deelEmployees, null, 2)}`);

			// Log active vs inactive employees
			const activeEmployees = deelEmployees.filter(
				(emp) =>
					emp.hiring_status === "active" || emp.new_hiring_status === "active",
			);
			const inactiveEmployees = deelEmployees.filter(
				(emp) =>
					emp.hiring_status !== "active" && emp.new_hiring_status !== "active",
			);
			logger.info(
				`Found ${activeEmployees.length} active employees and ${inactiveEmployees.length} inactive employees out of ${deelEmployees.length} total`,
			);

			// Process each employee
			const processedEmployees = [];
			logger.info("Starting to process employees...");

			for (const deelEmployee of deelEmployees) {
				// Process all employees, both active and inactive
				const isActive =
					deelEmployee.hiring_status === "active" ||
					deelEmployee.new_hiring_status === "active";

				logger.info(
					`Processing employee: ${deelEmployee.full_name} (ID: ${deelEmployee.id}, Status: ${isActive ? "active" : "inactive"})`,
				);

				const name =
					`${deelEmployee.first_name} ${deelEmployee.last_name}`.trim();

				// Handle empty department object
				const departmentName =
					deelEmployee.department &&
					typeof deelEmployee.department === "object" &&
					"name" in deelEmployee.department
						? deelEmployee.department.name
						: "";

				const department = mapDeelDepartment(departmentName);
				logger.info(
					`Employee department: ${departmentName} mapped to: ${department}`,
				);

				// Try to get work email first, then fall back to primary email
				const workEmail = deelEmployee.emails.find(
					(email) => email.type === "work" && email.value,
				)?.value;

				const primaryEmail = deelEmployee.emails.find(
					(email) => email.type === "primary" && email.value,
				)?.value;

				const email = workEmail || primaryEmail || "";

				if (workEmail) {
					logger.info(`Using work email: ${email}`);
				} else if (primaryEmail) {
					logger.info(`Falling back to primary email: ${email}`);
				}

				if (!email) {
					logger.warn(
						`Employee ${deelEmployee.full_name} has no work or primary email, skipping`,
					);
					continue;
				}

				logger.info(`Looking for existing employee with email: ${email}`);

				// Check if employee already exists using the reusable function
				const existingUser = await db.user.findFirst({
					where: {
						email,
					},
				});

				const existingEmployee = await db.member.findFirst({
					where: {
						userId: existingUser?.id,
						organizationId: integration.organization.id,
					},
				});

				if (existingEmployee) {
					logger.info(
						`Found existing employee with ID: ${existingEmployee.id}, updating...`,
					);
					// Update existing employee
					await db.member.update({
						where: {
							id: existingEmployee.id,
						},
						data: {
							department,
							isActive, // Set isActive based on Deel status
						},
					});
					logger.info(
						`Successfully updated employee: ${name} with isActive: ${isActive}`,
					);
					processedEmployees.push({
						id: existingEmployee.id,
						action: "updated",
						isActive,
					});
				} else {
					logger.info(
						`No existing employee found for ${email}, creating new employee...`,
					);
					try {
						// Create new employee using the reusable function
						const newEmployee = await completeEmployeeCreation({
							name,
							email,
							department,
							organizationId: integration.organization.id,
							externalEmployeeId: deelEmployee.id,
						});

						if (!newEmployee) {
							logger.error("Failed to create new employee");
							continue;
						}

						// If employee is inactive, update the isActive status after creation
						if (!isActive) {
							await db.member.update({
								where: {
									id: newEmployee.id,
								},
								data: {
									isActive: false,
								},
							});
							logger.info("Updated new employee to inactive status");
						}

						logger.info(
							`Successfully created new employee: ${name} with ID: ${newEmployee?.id}, isActive: ${isActive}`,
						);
						processedEmployees.push({
							id: newEmployee.id,
							action: "created",
							isActive,
						});
					} catch (error) {
						logger.error(
							`Error creating employee: ${error instanceof Error ? error.message : String(error)}`,
						);
						// Skip to the next employee if there's an error
					}
				}
			}

			logger.info(
				`Employee processing complete. Created/updated ${processedEmployees.length} employees.`,
			);
			logger.info(`Summary: ${JSON.stringify(processedEmployees, null, 2)}`);

			logger.info(`Deel employee sync completed for ${integration.name}`);
			return {
				success: true,
				processedCount: processedEmployees.length,
				totalFetched: deelEmployees.length,
			};
		} catch (error) {
			logger.error(`Error running Deel employee sync: ${error}`);
			logger.error(
				`Error stack: ${error instanceof Error ? error.stack : "No stack trace available"}`,
			);
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	},
});
