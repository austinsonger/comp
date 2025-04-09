"use client";

import type { Message as TMessage } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useEffect, useState } from "react";
import { useStreamableText } from "@/hooks/use-streamable-text";
import { MemoizedReactMarkdown } from "../markdown";
import { cn } from "@comp/ui/cn";
import { LogoSpinner } from "../logo-spinner";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { ChatAvatar } from "./chat-avatar";
import equal from "fast-deep-equal";
import type { StreamableValue } from "ai/rsc";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ErrorFallback } from "../error-fallback";

interface ToolInvocation {
	toolName: string;
	state: "call" | "result";
	result?: any;
}

interface ExtendedToolInvocation extends ToolInvocation {
	result?: any;
}

interface ReasoningPart {
	type: "reasoning";
	reasoning: string;
	details: Array<{ type: "text"; text: string }>;
}

interface ReasoningMessagePartProps {
	part: ReasoningPart;
	isReasoning: boolean;
}

export function ReasoningMessagePart({
	part,
	isReasoning,
}: ReasoningMessagePartProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const variants = {
		collapsed: {
			height: 0,
			opacity: 0,
			marginTop: 0,
			marginBottom: 0,
		},
		expanded: {
			height: "auto",
			opacity: 1,
			marginTop: "1rem",
			marginBottom: 0,
		},
	};

	const memoizedSetIsExpanded = useCallback((value: boolean) => {
		setIsExpanded(value);
	}, []);

	useEffect(() => {
		memoizedSetIsExpanded(isReasoning);
	}, [isReasoning, memoizedSetIsExpanded]);

	return (
		<div className="flex flex-col">
			{isReasoning ? (
				<div className="group relative flex items-start py-2">
					<div className="flex size-[25px] shrink-0 select-none items-center justify-center">
						<ChatAvatar role="assistant" />
					</div>
					<div className="ml-4 flex-1 overflow-hidden pl-2 text-xs">
						<div className="font-medium">Reasoning</div>
						<div className="animate-spin mt-2">
							<LogoSpinner raceColor="#00DC73" size={16} />
						</div>
					</div>
				</div>
			) : (
				<div className="group relative flex items-start py-2">
					<div className="flex size-[25px] shrink-0 select-none items-center justify-center">
						<ChatAvatar role="assistant" />
					</div>
					<div className="ml-4 flex-1 overflow-hidden pl-2 text-xs">
						<div className="flex items-center gap-2">
							<div className="font-medium">Reasoned for a few seconds</div>
							<button
								type="button"
								className={cn(
									"cursor-pointer rounded-full dark:hover:bg-accent hover:bg-zinc-200 p-1",
									{
										"dark:bg-accent bg-zinc-200": isExpanded,
									},
								)}
								onClick={() => {
									setIsExpanded(!isExpanded);
								}}
							>
								{isExpanded ? (
									<ChevronDownIcon className="h-4 w-4" />
								) : (
									<ChevronUpIcon className="h-4 w-4" />
								)}
							</button>
						</div>
					</div>
				</div>
			)}

			<AnimatePresence initial={false}>
				{isExpanded && (
					<motion.div
						key="reasoning"
						className="text-sm dark:text-zinc-400 text-zinc-600 flex flex-col gap-4 ml-[41px]"
						initial="collapsed"
						animate="expanded"
						exit="collapsed"
						variants={variants}
						transition={{ duration: 0.2, ease: "easeInOut" }}
					>
						{part.details.map((detail) =>
							detail.type === "text" ? (
								<StreamableMarkdown key={detail.text} text={detail.text} />
							) : (
								"<redacted>"
							),
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

const StreamableMarkdown = memo(
	({ text }: { text: string | StreamableValue<string> }) => {
		const streamedText = useStreamableText(text);

		return (
			<MemoizedReactMarkdown
				className="prose break-words dark:prose-invert leading-tight text-xs"
				components={{
					p({ children }) {
						return <div className="gap-0.5">{children}</div>;
					},
					ol({ children }) {
						return <ol>{children}</ol>;
					},
					ul({ children }) {
						return <ul>{children}</ul>;
					},
				}}
			>
				{streamedText}
			</MemoizedReactMarkdown>
		);
	},
);

const PurePreviewMessage = ({
	message,
	isLatestMessage,
	status,
}: {
	message: TMessage;
	isLoading: boolean;
	status: "error" | "submitted" | "streaming" | "ready";
	isLatestMessage: boolean;
}) => {
	return (
		<AnimatePresence key={message.id}>
			<motion.div
				className="w-full mx-auto px-4 group/message"
				initial={{ y: 5, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				key={`message-${message.id}`}
				data-role={message.role}
			>
				<div
					className={cn(
						"flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
						"group-data-[role=user]/message:w-fit",
					)}
				>
					<div className="flex flex-col w-full space-y-4">
						{message.parts?.map((part, i) => {
							switch (part.type) {
								case "text":
									return message.role === "user" ? (
										<motion.div
											initial={{ y: 5, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											key={`message-${message.id}-part-${i}`}
											className="flex flex-row gap-2 items-start w-full pb-2"
										>
											<div
												className={cn("flex flex-col gap-2", {
													"bg-secondary text-secondary-foreground px-3 py-2":
														message.role === "user",
												})}
											>
												<StreamableMarkdown text={part.text} />
											</div>
										</motion.div>
									) : (
										<motion.div
											initial={{ y: 5, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											key={`message-${message.id}-part-${i}`}
											className="flex flex-row gap-2 items-start w-full pb-2"
										>
											<BotCard key={`message-${message.id}-part-${i}`}>
												<StreamableMarkdown text={part.text} />
											</BotCard>
										</motion.div>
									);

								case "reasoning": {
									return (
										<ReasoningMessagePart
											key={`message-${message.id}-${i}`}
											// @ts-expect-error part
											part={part}
											isReasoning={
												(message.parts &&
													status === "streaming" &&
													i === message.parts.length - 1) ??
												false
											}
										/>
									);
								}
								default:
									return null;
							}
						})}
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export function ReasoningCard({
	children,
	showAvatar = true,
	className,
}: {
	children?: React.ReactNode;
	showAvatar?: boolean;
	className?: string;
}) {
	return (
		<ErrorBoundary errorComponent={ErrorFallback}>
			<div className={cn(className)}>
				<div className="flex flex-row gap-2 items-center">
					{showAvatar && <ChatAvatar role="assistant" />}
				</div>

				<div className="flex flex-col gap-2">{children}</div>
			</div>
		</ErrorBoundary>
	);
}

export function BotCard({
	children,
	showAvatar = true,
	className,
}: {
	children?: React.ReactNode;
	showAvatar?: boolean;
	className?: string;
}) {
	return (
		<ErrorBoundary errorComponent={ErrorFallback}>
			<div className="group relative flex items-start py-2">
				<div className="flex size-[25px] shrink-0 select-none items-center justify-center">
					{showAvatar && <ChatAvatar role="assistant" />}
				</div>

				<div
					className={cn(
						"ml-4 flex-1 overflow-hidden pl-2 text-xs leading-relaxed",
						className,
					)}
				>
					{children}
				</div>
			</div>
		</ErrorBoundary>
	);
}

export function UserMessage({ content }: { content: string }) {
	return (
		<ErrorBoundary errorComponent={ErrorFallback}>
			<div className="group relative flex items-start py-2">
				<div className="flex size-[25px] shrink-0 select-none items-center justify-center">
					<ChatAvatar role="user" />
				</div>

				<div className="ml-4 flex-1 overflow-hidden pl-2 text-xs leading-relaxed">
					<StreamableMarkdown text={content} />
				</div>
			</div>
		</ErrorBoundary>
	);
}

export const Message = memo(PurePreviewMessage, (prevProps, nextProps) => {
	if (prevProps.status !== nextProps.status) return false;

	if (prevProps.message.annotations !== nextProps.message.annotations)
		return false;

	if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

	return true;
});
