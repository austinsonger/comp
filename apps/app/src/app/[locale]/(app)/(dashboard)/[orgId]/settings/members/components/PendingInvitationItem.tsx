"use client";

import { revokeInvitation } from "@/actions/organization/revoke-invitation";
import { useI18n } from "@/locales/client";
import { authClient } from "@/utils/auth-client";
import type { Invitation } from "@comp/db/types";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@comp/ui/alert-dialog";
import { Button } from "@comp/ui/button";
import { formatDistance } from "date-fns";
import { Loader2, Mail, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PendingInvitationItemProps {
	invitation: Invitation;
}

export function PendingInvitationItem({
	invitation,
}: PendingInvitationItemProps) {
	const t = useI18n();
	const [isRevoking, setIsRevoking] = useState(false);

	const handleRevokeInvitation = async () => {
		setIsRevoking(true);
		try {
			const result = await revokeInvitation({
				invitationId: invitation.id,
			});

			if (result?.data?.success) {
				toast.success(
					`${t("settings.team.invitations.toast.revoke_success_prefix")} ${invitation.email} ${t("settings.team.invitations.toast.revoke_success_suffix")}`,
				);
			} else {
				toast.error(t("settings.team.invitations.toast.revoke_error"));
			}
		} catch (error) {
			toast.error(t("settings.team.invitations.toast.revoke_unexpected"));
		} finally {
			setIsRevoking(false);
		}
	};

	// Safety check - don't render if no email
	if (!invitation.email) return null;

	const timeAgo = formatDistance(new Date(invitation.expiresAt), new Date(), {
		addSuffix: true,
	});

	return (
		<div className="flex items-center justify-between p-4 border">
			<div className="flex items-center gap-4">
				<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
					<Mail className="h-5 w-5 text-muted-foreground" />
				</div>
				<div>
					<div className="font-medium">{invitation.email}</div>
					<div className="text-sm text-muted-foreground">
						{t("settings.team.invitations.expires_in")} {timeAgo}
					</div>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="destructive" size="icon" disabled={isRevoking}>
							{isRevoking ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Trash2 className="h-4 w-4" />
							)}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t("settings.team.invitations.actions.revoke_title")}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{t(
									"settings.team.invitations.actions.revoke_description_prefix",
								)}{" "}
								{invitation.email}?{" "}
								{t(
									"settings.team.invitations.actions.revoke_description_suffix",
								)}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>
								{t("common.actions.cancel")}
							</AlertDialogCancel>
							<AlertDialogAction onClick={handleRevokeInvitation}>
								{t("settings.team.invitations.actions.revoke")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
