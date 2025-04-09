import type { modelID } from "@/hooks/ai/providers";
import { Icons } from "@comp/ui/icons";
import { Popover, PopoverTrigger, PopoverContent } from "@comp/ui/popover";
import { Textarea as ShadcnTextarea } from "@comp/ui/textarea";
import { useRouter } from "next/navigation";

interface InputProps {
	input: string;
	handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	isLoading: boolean;
	status: string;
	stop: () => void;
	selectedModel: modelID;
	setSelectedModel: (model: modelID) => void;
}

export const ChatTextarea = ({
	input,
	handleInputChange,
	isLoading,
}: InputProps) => {
	const router = useRouter();

	const handleOpenUrl = (url: string) => {
		router.push(url);
	};
	return (
		<div className="relative w-full border-t">
			<ShadcnTextarea
				className="h-12 min-h-12 pt-3 resize-none border-none"
				value={input}
				autoFocus
				placeholder={"Ask Comp AI something..."}
				onChange={handleInputChange}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						if (input.trim() && !isLoading) {
							// @ts-expect-error err
							const form = e.target.closest("form");
							if (form) form.requestSubmit();
						}
					}
				}}
			/>

			<div className="hidden md:flex px-3 h-[40px] w-full border-t-[1px] items-center backdrop-filter dark:border-[#2C2C2C] backdrop-blur-lg dark:bg-[#151515]/[99]">
				<Popover>
					<PopoverTrigger>
						<div className="scale-50 opacity-50 -ml-2">
							<Icons.Logo />
						</div>
					</PopoverTrigger>

					<PopoverContent
						className="bg-background backdrop-filter dark:border-[#2C2C2C] backdrop-blur-lg dark:bg-[#1A1A1A]/95 p-2 rounded-lg -ml-2 w-auto"
						side="top"
						align="start"
						sideOffset={10}
					>
						<ul className="flex flex-col space-y-2">
							<li>
								<button
									type="button"
									className="flex space-x-2 items-center text-xs hover:bg-[#F2F1EF] dark:hover:bg-[#2b2b2b] rounded-md transition-colors w-full p-1"
									onClick={() => handleOpenUrl("https://x.com/compai")}
								>
									<Icons.X className="w-[16px] h-[16px]" />
									<span>Follow Comp AI</span>
								</button>
							</li>
							<li>
								<button
									type="button"
									className="flex space-x-2 items-center text-xs hover:bg-[#F2F1EF] dark:hover:bg-[#2b2b2b] rounded-md transition-colors w-full p-1"
									onClick={() => handleOpenUrl("https://discord.gg/compai")}
								>
									<Icons.Discord className="w-[16px] h-[16px]" />
									<span>Join our Discord</span>
								</button>
							</li>

							<li>
								<button
									type="button"
									className="flex space-x-2 items-center text-xs hover:bg-[#F2F1EF] dark:hover:bg-[#2b2b2b] rounded-md transition-colors w-full p-1"
									onClick={() => handleOpenUrl("https://git.new/compai")}
								>
									<Icons.GithubOutline className="w-[16px] h-[16px]" />
									<span>GitHub</span>
								</button>
							</li>
						</ul>
					</PopoverContent>
				</Popover>

				<div className="ml-auto flex space-x-4">
					<button className="flex space-x-2 items-center text-xs" type="submit">
						<span>Submit</span>
						<kbd className="pointer-events-none h-5 select-none items-center gap-1 border bg-accent px-1.5 font-mono text-[10px] font-medium">
							<span>↵</span>
						</kbd>
					</button>
				</div>
			</div>
		</div>
	);
};
