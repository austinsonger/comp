"use client";

import type { EmployeeStatusType } from "@/components/tables/people/employee-status";
import { formatDate } from "@/utils/format";
import { TrainingVideo } from "@comp/data";
import type {
	Departments,
	EmployeeTrainingVideoCompletion,
	Member,
	Policy,
	User,
} from "@comp/db/types";
import { Alert, AlertDescription, AlertTitle } from "@comp/ui/alert";
import { Button } from "@comp/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
import { Skeleton } from "@comp/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@comp/ui/tabs";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useEmployeeDetails } from "../../all/hooks/useEmployee";
import { updateEmployee } from "../actions/update-employee";
import { cn } from "@comp/ui/cn";
import { Input } from "@comp/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@comp/ui/form";

const DEPARTMENTS: { value: Departments; label: string }[] = [
	{ value: "admin", label: "Admin" },
	{ value: "gov", label: "Governance" },
	{ value: "hr", label: "HR" },
	{ value: "it", label: "IT" },
	{ value: "itsm", label: "IT Service Management" },
	{ value: "qms", label: "Quality Management" },
	{ value: "none", label: "None" },
];

const STATUS_OPTIONS: { value: EmployeeStatusType; label: string }[] = [
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
];

// Status priority and type definitions
const EMPLOYEE_STATUS_PRIORITY: EmployeeStatusType[] = [
	"active",
	"inactive",
] as const;
type IEmployeeStatusType = (typeof EMPLOYEE_STATUS_PRIORITY)[number];

// Status color mapping for UI components
const EMPLOYEE_STATUS_COLORS = {
	active: "bg-[var(--chart-open)]",
	inactive: "bg-[hsl(var(--destructive))]",
} as const;

// Status color hex values for charts
export const EMPLOYEE_STATUS_HEX_COLORS: Record<EmployeeStatusType, string> = {
	inactive: "#ef4444",
	active: "#10b981",
};

// Define form schema with Zod
const employeeFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	department: z.enum([
		"admin",
		"gov",
		"hr",
		"it",
		"itsm",
		"qms",
		"none",
	] as const),
	status: z.enum(["active", "inactive"] as const),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EmployeeDetailsProps {
	employeeId: string;
	employee: Member & {
		user: User;
	};
	policies: Policy[];
	trainingVideos: (EmployeeTrainingVideoCompletion & {
		metadata: TrainingVideo;
	})[];
}

export function EmployeeDetails({
	employeeId,
	employee,
	policies,
	trainingVideos,
}: EmployeeDetailsProps) {
	const { isLoading, error, mutate } = useEmployeeDetails(employeeId);
	const { orgId } = useParams<{ orgId: string }>();

	// Setup form with React Hook Form
	const form = useForm<EmployeeFormValues>({
		resolver: zodResolver(employeeFormSchema),
		defaultValues: {
			name: employee.user.name ?? "",
			email: employee.user.email ?? "",
			department: employee.department as Departments,
			status: employee.isActive ? "active" : "inactive",
		},
		mode: "onChange",
	});

	// Set initial form values when employee data loads
	useEffect(() => {
		if (employee) {
			form.reset({
				name: employee.user.name ?? "",
				email: employee.user.email ?? "",
				department: employee.department as Departments,
				status: employee.isActive ? "active" : "inactive",
			});
		}
	}, [employee, form]);

	const { execute, status: actionStatus } = useAction(updateEmployee, {
		onSuccess: () => {
			toast.success("Employee details updated successfully");
			mutate();
		},
		onError: (error) => {
			toast.error(
				error?.error?.serverError || "Failed to update employee details",
			);
		},
	});

	if (error) {
		if (error.code === "UNEXPECTED_ERROR") {
			redirect(`/${orgId}/employees`);
		}

		return (
			<div className="p-6">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						{error.message || "An unexpected error occurred"}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4">
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-60 w-full" />
			</div>
		);
	}

	if (!employee) return null;

	const onSubmit = async (values: EmployeeFormValues) => {
		// Prepare update data
		const updateData: {
			employeeId: string;
			name?: string;
			email?: string;
			department?: string;
			isActive?: boolean;
		} = { employeeId };

		// Only include changed fields
		if (values.name !== employee.user.name) {
			updateData.name = values.name;
		}
		if (values.email !== employee.user.email) {
			updateData.email = values.email;
		}
		if (values.department !== employee.department) {
			updateData.department = values.department;
		}

		const isActive = values.status === "active";
		if (isActive !== employee.isActive) {
			updateData.isActive = isActive;
		}

		// Execute the update only if there are changes
		if (Object.keys(updateData).length > 1) {
			await execute(updateData);
		} else {
			// No changes were made
			toast.info("No changes to save");
		}
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Employee Details Section */}
			<Card className="p-6">
				<CardHeader className="px-0 pt-0 pb-6">
					<CardTitle className="text-2xl font-semibold">
						Employee Details
					</CardTitle>
					<p className="text-muted-foreground">
						Manage employee information and department assignment
					</p>
				</CardHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<CardContent className="px-0 pb-8 space-y-8">
							{/* Personal Info Section */}
							<div>
								<h3 className="text-xs font-medium text-muted-foreground uppercase mb-3">
									Personal Info
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder="Employee name"
														className="h-10"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="email"
														placeholder="Employee email"
														className="h-10"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							{/* Department & Status Row */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
								<FormField
									control={form.control}
									name="department"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-medium text-muted-foreground uppercase">
												Department
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger className="h-10">
														<SelectValue placeholder="Select department" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{DEPARTMENTS.map((dept) => (
														<SelectItem key={dept.value} value={dept.value}>
															{dept.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-medium text-muted-foreground uppercase">
												Status
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger className="h-10">
														<SelectValue placeholder="Select status" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{STATUS_OPTIONS.map((option) => (
														<SelectItem key={option.value} value={option.value}>
															<div className={cn("flex items-center gap-2")}>
																<div
																	className={cn("size-2.5")}
																	style={{
																		backgroundColor:
																			EMPLOYEE_STATUS_HEX_COLORS[
																				option.value
																			] ?? "",
																	}}
																/>
																{option.label}
															</div>
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Join Date Row */}
							<div className="grid grid-cols-2 gap-10">
								<div>
									<h3 className="text-xs font-medium text-muted-foreground uppercase mb-3">
										Join Date
									</h3>
									<p className="text-sm">
										{formatDate(
											employee.createdAt.toISOString(),
											"MMM d, yyyy",
										)}
									</p>
								</div>
								<div />
							</div>
						</CardContent>
						<CardFooter className="px-0 py-0 flex justify-end outline-none border-none">
							<Button
								type="submit"
								disabled={
									!form.formState.isDirty ||
									form.formState.isSubmitting ||
									actionStatus === "executing"
								}
								className="w-auto"
							>
								{form.formState.isSubmitting || actionStatus === "executing"
									? "Saving..."
									: "Save"}
								{!(
									form.formState.isSubmitting || actionStatus === "executing"
								) && <Save className="ml-2 h-4 w-4" />}
							</Button>
						</CardFooter>
					</form>
				</Form>
			</Card>

			{/* Tasks Section */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<h2 className="text-lg font-medium">Employee Tasks</h2>
							<h3 className="text-sm text-muted-foreground">
								View and manage employee tasks and their status
							</h3>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="policies">
						<TabsList className="mb-4">
							<TabsTrigger value="policies">Policies</TabsTrigger>
							<TabsTrigger value="training">Training Videos</TabsTrigger>
						</TabsList>

						<TabsContent value="policies">
							<div className="flex flex-col gap-2">
								{policies.length === 0 ? (
									<div className="text-center py-6 text-muted-foreground">
										<p>No policies required to sign.</p>
									</div>
								) : (
									policies.map((policy) => {
										const isCompleted = policy.signedBy.includes(employee.id);

										return (
											<div
												key={policy.id}
												className="flex items-center gap-2 border p-3 justify-between"
											>
												<h2 className="flex items-center gap-2">
													{isCompleted ? (
														<CheckCircle2 className="h-4 w-4 text-green-500" />
													) : (
														<AlertCircle className="h-4 w-4 text-red-500" />
													)}
													{policy.name}
												</h2>
											</div>
										);
									})
								)}
							</div>
						</TabsContent>

						<TabsContent value="training">
							<div className="flex flex-col gap-2">
								{trainingVideos.length === 0 ? (
									<div className="text-center py-6 text-muted-foreground">
										<p>No training videos required to watch.</p>
									</div>
								) : (
									trainingVideos.map((video) => {
										const isCompleted = video.completedAt !== null;

										return (
											<div
												key={video.id}
												className="flex items-center gap-2 border p-3 justify-between "
											>
												<h2 className="flex flex-col items-center">
													<div className="flex items-center gap-2">
														{isCompleted ? (
															<div className="flex items-center gap-1">
																<CheckCircle2 className="h-4 w-4 text-green-500" />
															</div>
														) : (
															<AlertCircle className="h-4 w-4 text-red-500" />
														)}
														{video.metadata.title}
													</div>
													{isCompleted && (
														<span className="text-xs text-muted-foreground self-start">
															Completed -{" "}
															{video.completedAt &&
																new Date(
																	video.completedAt,
																).toLocaleDateString()}
														</span>
													)}
												</h2>
											</div>
										);
									})
								)}
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
