"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import { PendingInvitationItem } from "./PendingInvitationItem";
import type { Invitation } from "@comp/db/types";
import { useI18n } from "@/locales/client";

interface PendingInvitationsProps {
	pendingInvitations: Invitation[];
}

export function PendingInvitations({
	pendingInvitations,
}: PendingInvitationsProps) {
	const t = useI18n();

	if (pendingInvitations.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						{t("settings.team.invitations.empty.no_invitations.title")}
					</CardTitle>
					<CardDescription>
						{t("settings.team.invitations.empty.no_invitations.description")}
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>{t("settings.team.invitations.title")}</CardTitle>
					<CardDescription>
						{t("settings.team.invitations.description")} (
						{pendingInvitations.length})
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{pendingInvitations.map((invitation) => (
							<PendingInvitationItem
								key={invitation.id}
								invitation={invitation}
							/>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
