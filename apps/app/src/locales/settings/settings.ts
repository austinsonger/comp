export const settings = {
	general: {
		title: "General",
		org_name: "Organization name",
		org_name_description:
			"This is your organizations visible name. You should use the legal name of your organization.",
		org_name_tip: "Please use 32 characters at maximum.",
		org_website: "Organization Website",
		org_website_description:
			"This is your organization's official website URL. Make sure to include the full URL with https://.",
		org_website_tip: "Please enter a valid URL including https://",
		org_website_error: "Error updating organization website",
		org_website_updated: "Organization website updated",
		org_delete: "Delete organization",
		org_delete_description:
			"Permanently remove your organization and all of its contents from the Comp AI platform. This action is not reversible - please continue with caution.",
		org_delete_alert_title: "Are you absolutely sure?",
		org_delete_alert_description:
			"This action cannot be undone. This will permanently delete your organization and remove your data from our servers.",
		delete_confirm_tip: "Type 'delete' to confirm",
		delete_confirm: "delete",
		org_delete_error: "Error deleting organization",
		org_delete_success: "Organization deleted",
		org_name_updated: "Organization name updated",
		org_name_error: "Error updating organization name",
	},
	members: {
		title: "Members",
	},
	api_keys: {
		title: "API",
		description:
			"Manage API keys for programmatic access to your organization's data.",
		list_title: "API Keys",
		list_description:
			"API keys allow secure access to your organization's data via our API.",
		create: "New API Key",
		create_title: "New API Key",
		create_description:
			"Create a new API key for programmatic access to your organization's data.",
		created_title: "API Key Created",
		created_description:
			"Your API key has been created. Make sure to copy it now as you won't be able to see it again.",
		name: "Name",
		name_placeholder: "Enter a name for this API key",
		expiration: "Expiration",
		expiration_placeholder: "Select expiration",
		thirty_days: "30 days",
		ninety_days: "90 days",
		one_year: "1 year",
		api_key: "API Key",
		save_warning: "This key will only be shown once. Make sure to copy it now.",
		copied: "API key copied to clipboard",
		revoke_confirm:
			"Are you sure you want to revoke this API key? This action cannot be undone.",
		revoke_title: "Revoke API Key",
		revoke: "Revoke",
		created: "Created",
		expires: "Expires",
		last_used: "Last Used",
		actions: "Actions",
		never: "Never",
		never_used: "Never used",
		no_keys: "No API keys found. Create one to get started.",
		security_note:
			"API keys provide full access to your organization's data. Keep them secure and rotate them regularly.",
		fetch_error: "Failed to fetch API keys",
		create_error: "Failed to create API key",
		revoked_success: "API key revoked successfully",
		revoked_error: "Failed to revoke API key",
		done: "Done",
	},
	billing: {
		title: "Billing",
	},
	team: {
		tabs: {
			members: "Team Members",
			invite: "Invite Members",
		},
		members: {
			title: "Team Members",
			description: "Manage your team members and their roles",
			empty: {
				no_organization: {
					title: "No Organization",
					description: "You are not part of any organization",
				},
				no_members: {
					title: "No Members",
					description: "There are no active members in your organization",
				},
			},
			status: {
				active: "Active",
				inactive: "Inactive",
			},
			role: {
				owner: "Owner",
				admin: "Admin",
				member: "Member",
				auditor: "Auditor",
				employee: "Employee",
			},
		},
		invitations: {
			title: "Pending Invitations",
			description: "Users who have been invited but haven't accepted yet",
			empty: {
				no_organization: {
					title: "No Organization",
					description: "You are not part of any organization",
				},
				no_invitations: {
					title: "No Pending Invitations",
					description: "There are no pending invitations",
				},
			},
			invitation_sent: "Invitation sent",
			expires_in: "Expires in",
			actions: {
				resend: "Resend Invite",
				sending: "Sending Invite",
				revoke: "Revoke",
				revoke_title: "Revoke Invitation",
				revoke_description_prefix:
					"Are you sure you want to revoke the invitation for",
				revoke_description_suffix: "This action cannot be undone.",
			},
			toast: {
				resend_success_prefix: "An invitation email has been sent to",
				resend_error: "Failed to send invitation",
				resend_unexpected:
					"An unexpected error occurred while sending the invitation",
				revoke_success_prefix: "Invitation to",
				revoke_success_suffix: "has been revoked",
				revoke_error: "Failed to revoke invitation",
				revoke_unexpected:
					"An unexpected error occurred while revoking the invitation",
			},
		},
		invite: {
			title: "Invite Team Member",
			description:
				"Send an invitation to a new team member to join your organization",
			error: {
				title: "Invitation Error",
				description: "There was an error processing your invitation.",
				home: "Go to Home",
			},
			form: {
				email: {
					label: "Email",
					placeholder: "member@example.com",
					error: "Please enter a valid email address",
				},
				role: {
					label: "Role",
					placeholder: "Select a role",
					error: "Please select a role",
				},
				department: {
					label: "Department",
					placeholder: "Select a department",
					error: "Please select a department",
				},
				departments: {
					none: "None",
					it: "IT",
					hr: "HR",
					admin: "Admin",
					gov: "Government",
					itsm: "ITSM",
					qms: "QMS",
				},
			},
			button: {
				send: "Send Invitation",
				sending: "Sending invitation...",
				sent: "Invitation Sent",
			},
			toast: {
				error: "Failed to send invitation",
				unexpected: "An unexpected error occurred while sending the invitation",
			},
		},
		member_actions: {
			actions: "Actions",
			change_role: "Change Role",
			remove_member: "Remove Member",
			remove_confirm: {
				title: "Remove Team Member",
				description_prefix: "Are you sure you want to remove",
				description_suffix: "This action cannot be undone.",
			},
			role_dialog: {
				title: "Change Role",
				description_prefix: "Update the role for",
				role_label: "Role",
				role_placeholder: "Select a role",
				role_descriptions: {
					admin: "Admins can manage team members and settings.",
					auditor:
						"Auditors can use all features but cannot manage team members.",
					employee: "Employees can only view content without making changes.",
				},
				cancel: "Cancel",
				update: "Update Role",
			},
			toast: {
				remove_success: "has been removed from the organization",
				remove_error: "Failed to remove member",
				remove_unexpected:
					"An unexpected error occurred while removing the member",
				update_role_success: "has had their role updated to",
				update_role_error: "Failed to update member role",
				update_role_unexpected:
					"An unexpected error occurred while updating the member's role",
			},
		},
	},
} as const;
