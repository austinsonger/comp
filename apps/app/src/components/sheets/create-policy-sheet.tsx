"use client";

import { useI18n } from "@/locales/client";
import { Button } from "@comp/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@comp/ui/drawer";
import { useMediaQuery } from "@comp/ui/hooks";
import { ScrollArea } from "@comp/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@comp/ui/sheet";
import { X } from "lucide-react";
import { useQueryState } from "nuqs";
import { CreateNewPolicyForm } from "../forms/policies/create-new-policy";

export function CreatePolicySheet() {
	const t = useI18n();
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [open, setOpen] = useQueryState("create-policy-sheet");
	const isOpen = Boolean(open);

	const handleOpenChange = (open: boolean) => {
		setOpen(open ? "true" : null);
	};

	if (isDesktop) {
		return (
			<Sheet open={isOpen} onOpenChange={handleOpenChange}>
				<SheetContent stack>
					<SheetHeader className="mb-8 flex justify-between items-center flex-row">
						<SheetTitle>{t("policies.create_new")}</SheetTitle>
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
						<CreateNewPolicyForm />
					</ScrollArea>
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerTitle hidden>{t("policies.create_new")}</DrawerTitle>
			<DrawerContent className="p-6">
				<CreateNewPolicyForm />
			</DrawerContent>
		</Drawer>
	);
}
