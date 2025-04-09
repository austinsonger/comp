"use client";

import { Avatar, AvatarFallback, AvatarImageNext } from "@comp/ui/avatar";
import { Icons } from "@comp/ui/icons";
import { useSession } from "@/utils/auth-client";

type Props = {
	role: "assistant" | "user";
};

export function ChatAvatar({ role }: Props) {
	const { data: session } = useSession();

	switch (role) {
		case "user": {
			return (
				<Avatar className="size-6">
					<AvatarImageNext
						src={session?.user?.image || ""}
						alt={session?.user?.name || ""}
						width={24}
						height={24}
					>
						<AvatarFallback>
							{session?.user?.name?.split(" ").at(0)?.charAt(0)}
						</AvatarFallback>
					</AvatarImageNext>
				</Avatar>
			);
		}

		default:
			return <Icons.Logo />;
	}
}
