"use client";

import { ButtonIcon } from "@/components/ui/button-icon";
import { useI18n } from "@/locales/client";
import { authClient } from "@/utils/auth-client";
import { Button } from "@comp/ui/button";
import { Icons } from "@comp/ui/icons";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function GithubSignIn({
	inviteCode,
}: {
	inviteCode?: string;
}) {
	const t = useI18n();
	const [isLoading, setLoading] = useState(false);

	const handleSignIn = async () => {
		setLoading(true);

		const redirectTo = inviteCode
			? `/api/auth/invitation?code=${inviteCode}`
			: "/";

		await authClient.signIn.social({
			provider: "github",
		});
	};

	return (
		<Button
			onClick={handleSignIn}
			className="flex h-[40px] w-full space-x-2 px-6 py-4 font-medium active:scale-[0.98]"
		>
			{isLoading ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<>
					<ButtonIcon className="mr-2" isLoading={isLoading}>
						<Icons.Github />
					</ButtonIcon>
					<span>{t("auth.github")}</span>
				</>
			)}
		</Button>
	);
}
