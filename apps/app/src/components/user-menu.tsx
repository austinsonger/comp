import { auth } from "@/utils/auth";
import { getI18n } from "@/locales/server";
import { Avatar, AvatarFallback, AvatarImageNext } from "@comp/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@comp/ui/dropdown-menu";
import { SignOut } from "./sign-out";
import { headers } from "next/headers";

export async function UserMenu({ onlySignOut }: { onlySignOut?: boolean }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const t = await getI18n();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="rounded-full w-8 h-8 cursor-pointer">
					{session?.user?.image && (
						<AvatarImageNext
							src={session?.user?.image}
							alt={session?.user?.name ?? ""}
							width={32}
							height={32}
							quality={100}
						/>
					)}
					<AvatarFallback>
						<span className="text-xs">
							{session?.user?.name?.charAt(0)?.toUpperCase()}
						</span>
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[240px]" sideOffset={10} align="end">
				{!onlySignOut && (
					<>
						<DropdownMenuLabel>
							<div className="flex justify-between items-center">
								<div className="flex flex-col">
									<span className="truncate line-clamp-1 max-w-[155px] block">
										{session?.user?.name}
									</span>
									<span className="truncate text-xs text-[#606060] font-normal">
										{session?.user?.email}
									</span>
								</div>
								<div className="border py-0.5 px-3 rounded-full text-[11px] font-normal">
									Beta
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{/* <DropdownMenuGroup>
              <Link prefetch href="/account">
                <DropdownMenuItem>
                  {t("user_menu.account")}
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>

              <Link prefetch href="/account/support">
                <DropdownMenuItem>{t("user_menu.support")}</DropdownMenuItem>
              </Link>

              <Link prefetch href="/account/teams">
                <DropdownMenuItem>
                  {t("user_menu.teams")}
                  <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
						{/* <div className="flex flex-row justify-between items-center p-2">
              <p className="text-sm">{t("user_menu.theme")}</p>
              <ThemeSwitch />
            </div>{" "}
            <DropdownMenuSeparator />{" "}
            <div className="flex flex-row justify-between items-center p-2">
              <p className="text-sm">{t("user_menu.language")}</p>
              <LocaleSwitch />
            </div>{" "} */}
					</>
				)}

				<SignOut />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
