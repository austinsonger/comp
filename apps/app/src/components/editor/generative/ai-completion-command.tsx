import { CommandGroup, CommandItem, CommandSeparator } from "@comp/ui/command";
import { TrashIcon } from "lucide-react";

const AICompletionCommands = ({
	onDiscard,
}: {
	onDiscard: () => void;
}) => {
	return (
		<>
			<CommandSeparator />
			<CommandGroup>
				<CommandItem onSelect={onDiscard} value="thrash" className="gap-2 px-4">
					<TrashIcon className="h-4 w-4 text-muted-foreground" />
					Discard
				</CommandItem>
			</CommandGroup>
		</>
	);
};

export default AICompletionCommands;
