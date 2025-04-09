"use client";

import { Separator } from "@comp/ui/separator";
import {
	EditorCommand,
	EditorCommandEmpty,
	EditorCommandItem,
	EditorCommandList,
	EditorContent,
	EditorRoot,
	type JSONContent,
	handleCommandNavigation,
} from "novel";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";

import { Extensions } from "@tiptap/core";
import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { TextButtons } from "./selectors/text-buttons";
import { suggestionItems } from "./slash-command";

const extensions: Extensions = [...defaultExtensions];

interface AdvancedEditorProps {
	initialContent?: JSONContent | JSONContent[];
	onUpdate?: (content: JSONContent) => void;
	onSave?: (content: JSONContent) => Promise<void>;
	readOnly?: boolean;
	placeholder?: string;
	className?: string;
	saveDebounceMs?: number;
}

const AdvancedEditor = ({
	initialContent,
	onUpdate,
	onSave,
	readOnly = false,
	placeholder = "Start writing...",
	className,
	saveDebounceMs = 500,
}: AdvancedEditorProps) => {
	const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving" | "Unsaved">(
		"Saved",
	);
	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const [charsCount, setCharsCount] = useState();

	const [openNode, setOpenNode] = useState(false);
	const [openColor, setOpenColor] = useState(false);
	const [openLink, setOpenLink] = useState(false);
	const [openAI, setOpenAI] = useState(false);

	useEffect(() => {
		setInitialLoadComplete(true);
	}, []);

	const debouncedSave = useDebouncedCallback(async (content: JSONContent) => {
		if (!onSave) return;

		setSaveStatus("Saving");

		try {
			await onSave(content);
			setSaveStatus("Saved");
		} catch (err) {
			console.error("Failed to save content:", err);
			setSaveStatus("Unsaved");
		}
	}, saveDebounceMs);

	if (!initialContent) return null;

	return (
		<div className="relative w-full max-w-screen-lg">
			<div className="flex absolute right-5 top-5 z-10 mb-5 gap-2">
				<div className="bg-accent px-2 py-1 text-sm text-muted-foreground">
					{saveStatus}
				</div>
				<div
					className={
						charsCount
							? "bg-accent px-2 py-1 text-sm text-muted-foreground"
							: "hidden"
					}
				>
					{charsCount} Words
				</div>
			</div>
			<EditorRoot>
				<EditorContent
					immediatelyRender={false}
					initialContent={initialContent}
					extensions={extensions}
					className="relative min-h-[500px] w-full max-w-screen-lg bg-background sm:mb-[calc(20vh)] p-2"
					editorProps={{
						handleDOMEvents: {
							keydown: (_view, event) => handleCommandNavigation(event),
						},
						attributes: {
							class:
								"prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
						},
					}}
					onUpdate={({ editor }) => {
						const content = editor.getJSON();
						setCharsCount(editor.storage.characterCount.words());

						if (onUpdate) {
							onUpdate(content);
						}

						if (initialLoadComplete && onSave) {
							setSaveStatus("Unsaved");
							debouncedSave(content);
						}
					}}
				>
					<EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto border border-muted bg-background px-1 py-2 shadow-md transition-all">
						<EditorCommandEmpty className="px-2 text-muted-foreground">
							No results
						</EditorCommandEmpty>
						<EditorCommandList>
							{suggestionItems.map((item: any) => (
								<EditorCommandItem
									value={item.title}
									onCommand={(val) => item.command(val)}
									className="flex w-full items-center space-x-2 px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
									key={item.title}
								>
									<div className="flex h-10 w-10 items-center justify-center border border-muted bg-background">
										{item.icon}
									</div>
									<div>
										<p className="font-medium">{item.title}</p>
										<p className="text-xs text-muted-foreground">
											{item.description}
										</p>
									</div>
								</EditorCommandItem>
							))}
						</EditorCommandList>
					</EditorCommand>

					<GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
						<Separator orientation="vertical" />
						<NodeSelector open={openNode} onOpenChange={setOpenNode} />
						<Separator orientation="vertical" />

						<LinkSelector open={openLink} onOpenChange={setOpenLink} />
						<Separator orientation="vertical" />
						<MathSelector />
						<Separator orientation="vertical" />
						<TextButtons />
						<Separator orientation="vertical" />
					</GenerativeMenuSwitch>
				</EditorContent>
			</EditorRoot>
		</div>
	);
};

export default AdvancedEditor;
