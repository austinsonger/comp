import { Button } from "@bubba/ui/button";
import type { Editor } from "@tiptap/react";
import { EditorBubble, removeAIHighlight, useEditor } from "novel";
import { Fragment, type ReactNode, useEffect } from "react";
import Magic from "../ui/icons/magic";
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
    //@ts-ignore
    if (!open) removeAIHighlight(editor as Editor);
  }, [open]);
  return (
    <EditorBubble
      tippyOptions={{
        placement: open ? "bottom" : "top",
        onHidden: () => {
          onOpenChange(false);
          editor?.chain().unsetAIHighlight().run();
        },
      }}
      className="flex w-fit  border border-muted bg-background shadow-xl"
    >
      {open && <AISelector open={open} onOpenChange={onOpenChange} />}
      {!open && (
        <Fragment>
          <Button
            className="gap-1 rounded-none font-medium"
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
