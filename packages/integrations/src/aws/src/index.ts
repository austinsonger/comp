import {
	SecurityHubClient,
	GetFindingsCommand,
} from "@aws-sdk/client-securityhub";
import type {
	SecurityHubClientConfig,
	GetFindingsCommandInput,
	GetFindingsCommandOutput,
} from "@aws-sdk/client-securityhub";

interface AWSCredentials {
	region: string;
	access_key_id: string;
	secret_access_key: string;
}

interface AWSFinding {
	title: string;
	description: string;
	remediation: string;
	status: string;
	severity: string;
	resultDetails: any;
}

/**
 * Fetches security findings from AWS Security Hub
 * @returns Promise containing an array of findings
 */
async function fetch(credentials: AWSCredentials): Promise<AWSFinding[]> {
	console.log("Fetching AWS Security Hub findings");
	try {
		// 1. Configure the SecurityHub client with AWS credentials
		const config: SecurityHubClientConfig = {
			region: credentials.region,
			credentials: {
				accessKeyId: credentials.access_key_id,
				secretAccessKey: credentials.secret_access_key,
			},
		};
		const securityHubClient = new SecurityHubClient(config);

		// 2. Define filters for the findings we want to retrieve.
		const params: GetFindingsCommandInput = {
			Filters: {
				WorkflowStatus: [{ Value: "NEW", Comparison: "EQUALS" }], // only active findings
				ComplianceStatus: [{ Value: "FAILED", Comparison: "EQUALS" }], // only failed control checks
			},
			MaxResults: 100, // adjust page size as needed (max 100)
		};

		const command = new GetFindingsCommand(params);
		let response: GetFindingsCommandOutput = await securityHubClient.send(command);
		
		const allFindings: AWSFinding[] = [];
		
		// Process initial response
		if (response.Findings) {
			const transformedFindings = response.Findings.map(finding => ({
				title: finding.Title || "Untitled Finding",
				description: finding.Description || "No description available",
				remediation: finding.Remediation?.Recommendation?.Text || "No remediation available",
				status: finding.Compliance?.Status || "unknown",
				severity: finding.Severity?.Label || "INFO",
				resultDetails: finding
			}));
			allFindings.push(...transformedFindings);
		}

		let nextToken = response.NextToken;
		
		// Continue pagination if there are more results
		while (nextToken) {
			const nextPageParams: GetFindingsCommandInput = {
				...params,
				NextToken: nextToken,
			};
			response = await securityHubClient.send(
				new GetFindingsCommand(nextPageParams),
			);

			if (response.Findings) {
				const transformedFindings = response.Findings.map(finding => ({
					title: finding.Title || "Untitled Finding",
					description: finding.Description || "No description available",
					remediation: finding.Remediation?.Recommendation?.Text || "No remediation available",
					status: finding.Compliance?.Status || "unknown",
					severity: finding.Severity?.Label || "INFO",
					resultDetails: finding
				}));
				allFindings.push(...transformedFindings);
			}

			nextToken = response.NextToken;
		}

		console.log("Retrieved", allFindings.length, "findings");
		return allFindings;
	} catch (error) {
		console.error("Error fetching Security Hub findings:", error);
		throw error;
	}
}

// Export the function and types for use in other modules
export { fetch };
export type { AWSCredentials, AWSFinding };
