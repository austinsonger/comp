import { CommandGroup, CommandItem, CommandSeparator } from "@bubba/ui/command";
import {
  ArrowDownWideNarrow,
  CheckCheck,
  RefreshCcwDot,
  StepForward,
  WrapText,
} from "lucide-react";
import { useEditor } from "novel";

const options = [
  {
    value: "improve",
    label: "Improve writing",
    icon: RefreshCcwDot,
  },
  {
    value: "fix",
    label: "Fix grammar",
    icon: CheckCheck,
  },
  {
    value: "shorter",
    label: "Make shorter",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "longer",
    label: "Make longer",
    icon: WrapText,
  },
];

interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void;
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor();

  return (
    <>
      <CommandGroup heading="Edit or review selection">
        {options.map((option) => (
          <CommandItem
            onSelect={(value) => {
              if (!editor) return;
              const selection = editor.state.selection;
              const selectedText = editor.state.doc.textBetween(
                selection.from,
                selection.to,
                " ",
              );
              onSelect(selectedText, value);
            }}
            className="flex gap-2"
            key={option.value}
            value={option.value}
          >
            <option.icon className="h-4 w-4 text-muted-foreground" />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Use AI to do more">
        <CommandItem
          onSelect={() => {
            if (!editor) return;
            const { $from } = editor.state.selection;
            const node = $from.node();

            // Get the text content of the current node
            const currentNodeText = node.textContent;
            console.log("Current node text:", currentNodeText);

            // If there's no text in the current node, try to get text from parent
            if (!currentNodeText && $from.parent) {
              const parentText = $from.parent.textContent;
              console.log("Parent node text:", parentText);
              onSelect(parentText, "continue");
              return;
            }

            onSelect(currentNodeText, "continue");
          }}
          value="continue"
          className="gap-2"
        >
          <StepForward className="h-4 w-4 text-muted-foreground" />
          Continue writing
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AISelectorCommands;
