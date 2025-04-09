import { EditorBubble, removeAIHighlight, useEditor } from "novel";
import { Fragment, type ReactNode, useEffect } from "react";
import { Button } from "@comp/ui/button";
import Magic from "../icons/magic";
import { AISelector } from "./ai-selector";

interface GenerativeMenuSwitchProps {
	children: ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
const GenerativeMenuSwitch = ({
	children,
	open,
	onOpenChange,
}: GenerativeMenuSwitchProps) => {
	const { editor } = useEditor();

	useEffect(() => {
		if (!open || !editor) return;
		removeAIHighlight(editor);
	}, [open]);
	return (
		<EditorBubble
			tippyOptions={{
				placement: open ? "bottom-start" : "top",
				onHidden: () => {
					onOpenChange(false);
					if (editor) editor.chain().unsetAIHighlight().run();
				},
			}}
			className="flex w-fit max-w-[90vw] overflow-hidden border border-muted bg-background shadow-xl"
		>
			{open && <AISelector open={open} onOpenChange={onOpenChange} />}
			{!open && (
				<Fragment>
					<Button
						className="gap-1 rounded-none"
						variant="ghost"
						onClick={() => onOpenChange(true)}
						size="sm"
					>
						<Magic className="h-5 w-5" />
						AI
					</Button>
					{children}
				</Fragment>
			)}
		</EditorBubble>
	);
};

export default GenerativeMenuSwitch;
