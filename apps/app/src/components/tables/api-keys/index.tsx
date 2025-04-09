"use client";

import { revokeApiKeyAction } from "@/actions/organization/revoke-api-key-action";
import type { ApiKey } from "@/hooks/use-api-keys";
import { useI18n } from "@/locales/client";
import { Button } from "@comp/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@comp/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@comp/ui/table";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { CreateApiKeyDialog } from "./create-api-key-dialog";

export function ApiKeysTable({ apiKeys }: { apiKeys: ApiKey[] }) {
	const t = useI18n();
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);
	const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);

	const { execute: revokeApiKey, status: isRevoking } = useAction(
		revokeApiKeyAction,
		{
			onSuccess: () => {
				toast.success(t("settings.api_keys.revoked_success"));
				setIsRevokeDialogOpen(false);
				setKeyToRevoke(null);
			},
			onError: () => {
				toast.error(t("settings.api_keys.revoked_error"));
				setIsRevokeDialogOpen(false);
				setKeyToRevoke(null);
			},
		},
	);

	const handleRevokeClick = (id: string) => {
		setKeyToRevoke(id);
		setIsRevokeDialogOpen(true);
	};

	const handleConfirmRevoke = () => {
		if (keyToRevoke) {
			revokeApiKey({ id: keyToRevoke });
		}
	};

	const handleCancelRevoke = () => {
		setIsRevokeDialogOpen(false);
		setKeyToRevoke(null);
	};

	const formatDate = (dateString: string | null) => {
		if (!dateString) return "-";
		return new Date(dateString).toLocaleDateString();
	};

	return (
		<>
			<Card>
				<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<CardTitle>{t("settings.api_keys.list_title")}</CardTitle>
						<CardDescription>
							{t("settings.api_keys.list_description")}
						</CardDescription>
					</div>
					<Button
						onClick={() => setIsCreateDialogOpen(true)}
						className="flex items-center gap-1 self-start sm:self-auto"
					>
						<Plus className="h-4 w-4" />
						{t("settings.api_keys.create")}
					</Button>
				</CardHeader>
				<CardContent>
					{apiKeys.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground">
							{t("settings.api_keys.no_keys")}
						</div>
					) : (
						<div className="overflow-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>{t("settings.api_keys.name")}</TableHead>
										<TableHead className="hidden sm:table-cell">
											{t("settings.api_keys.created")}
										</TableHead>
										<TableHead className="hidden md:table-cell">
											{t("settings.api_keys.expires")}
										</TableHead>
										<TableHead className="hidden md:table-cell">
											{t("settings.api_keys.last_used")}
										</TableHead>
										<TableHead className="text-right">
											{t("settings.api_keys.actions")}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{apiKeys.map((apiKey) => (
										<TableRow key={apiKey.id}>
											<TableCell className="font-medium">
												<div>
													{apiKey.name}
													<div className="sm:hidden mt-1 text-xs text-muted-foreground">
														{t("settings.api_keys.created")}:{" "}
														{formatDate(apiKey.createdAt)}
													</div>
													<div className="md:hidden mt-1 text-xs text-muted-foreground">
														{t("settings.api_keys.expires")}:{" "}
														{apiKey.expiresAt
															? formatDate(apiKey.expiresAt)
															: t("settings.api_keys.never")}
													</div>
												</div>
											</TableCell>
											<TableCell className="hidden sm:table-cell">
												{formatDate(apiKey.createdAt)}
											</TableCell>
											<TableCell className="hidden md:table-cell">
												{apiKey.expiresAt
													? formatDate(apiKey.expiresAt)
													: t("settings.api_keys.never")}
											</TableCell>
											<TableCell className="hidden md:table-cell">
												{apiKey.lastUsedAt
													? formatDate(apiKey.lastUsedAt)
													: t("settings.api_keys.never_used")}
											</TableCell>
											<TableCell className="text-right">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleRevokeClick(apiKey.id)}
													disabled={isRevoking === "executing"}
													aria-label={t("settings.api_keys.revoke")}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
				<CardFooter>{t("settings.api_keys.security_note")}</CardFooter>

				<CreateApiKeyDialog
					open={isCreateDialogOpen}
					onOpenChange={setIsCreateDialogOpen}
				/>
			</Card>

			<Dialog open={isRevokeDialogOpen} onOpenChange={handleCancelRevoke}>
				<DialogContent className="sm:max-w-md mx-4 w-[calc(100%-2rem)] sm:w-full">
					<DialogHeader>
						<DialogTitle>{t("settings.api_keys.revoke_title")}</DialogTitle>
						<DialogDescription>
							{t("settings.api_keys.revoke_confirm")}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={handleCancelRevoke}
							disabled={isRevoking === "executing"}
							className="w-full sm:w-auto"
						>
							{t("common.actions.cancel")}
						</Button>
						<Button
							type="button"
							variant="destructive"
							onClick={handleConfirmRevoke}
							disabled={isRevoking === "executing"}
							className="w-full sm:w-auto"
						>
							{isRevoking === "executing" && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{t("settings.api_keys.revoke")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
