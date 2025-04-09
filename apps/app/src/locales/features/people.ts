export const people = {
	title: "People",
	all: "Employees",
	details: {
		title: "Employee Details",
		tasks: "Tasks",
	},
	status: {
		active: "Active",
		inactive: "Inactive",
	},
	description: "Manage your team members and their roles.",
	filters: {
		search: "Search people...",
		role: "Filter by role",
	},
	actions: {
		invite: "Add Employee",
		clear: "Clear filters",
	},
	table: {
		name: "Name",
		email: "Email",
		department: "Department",
		status: "Status",
	},
	empty: {
		no_employees: {
			title: "No employees yet",
			description: "Get started by inviting your first team member.",
		},
		no_results: {
			title: "No results found",
			description: "No employees match your search",
			description_with_filters: "Try adjusting your filters",
		},
	},
	invite: {
		title: "Add Employee",
		description: "Add an employee to your organization.",
		email: {
			label: "Email address",
			placeholder: "Enter email address",
		},
		role: {
			label: "Role",
			placeholder: "Select a role",
		},
		name: {
			label: "Name",
			placeholder: "Enter name",
		},
		department: {
			label: "Department",
			placeholder: "Select a department",
		},
		submit: "Add Employee",
		success:
			"Employee added successfully, they will receive an email to join the portal.",
		error: "Failed to add employee",
	},
	dashboard: {
		title: "Dashboard",
		employee_task_completion: "Employee Task Completion",
		policies_completed: "Policies Completed",
		policies_pending: "Policies Pending",
		trainings_completed: "Trainings Completed",
		trainings_pending: "Trainings Pending",
		policies: "Policies",
		trainings: "Trainings",
		completed: "Completed",
		not_completed: "Not Completed",
		no_data: "No employee data available",
		no_tasks_completed: "No tasks have been completed yet",
		no_tasks_available: "No tasks available to complete",
	},
} as const;
