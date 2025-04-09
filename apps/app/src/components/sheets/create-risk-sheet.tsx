"use client";

import { useI18n } from "@/locales/client";
import { Button } from "@comp/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@comp/ui/drawer";
import { useMediaQuery } from "@comp/ui/hooks";
import { ScrollArea } from "@comp/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@comp/ui/sheet";
import { X } from "lucide-react";
import { useQueryState } from "nuqs";
import { CreateRisk } from "../forms/risks/create-risk-form";
import { Member, User } from "@comp/db/types";

export function CreateRiskSheet({
	assignees,
}: {
	assignees: (Member & { user: User })[];
}) {
	const t = useI18n();
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [open, setOpen] = useQueryState("create-risk-sheet");
	const isOpen = Boolean(open);

	const handleOpenChange = (open: boolean) => {
		setOpen(open ? "true" : null);
	};

	if (isDesktop) {
		return (
			<Sheet open={isOpen} onOpenChange={handleOpenChange}>
				<SheetContent stack>
					<SheetHeader className="mb-8 flex justify-between items-center flex-row">
						<SheetTitle>{t("risk.create")}</SheetTitle>
						<Button
							size="icon"
							variant="ghost"
							className="p-0 m-0 size-auto hover:bg-transparent"
							onClick={() => setOpen(null)}
						>
							<X className="h-5 w-5" />
						</Button>
					</SheetHeader>

					<ScrollArea className="h-full p-0 pb-[100px]" hideScrollbar>
						<CreateRisk assignees={assignees} />
					</ScrollArea>
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerTitle hidden>{t("risk.create")}</DrawerTitle>
			<DrawerContent className="p-6">
				<CreateRisk assignees={assignees} />
			</DrawerContent>
		</Drawer>
	);
}
