"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@comp/ui/accordion";
import Image from "next/image";
import { Button } from "@comp/ui/button";
import { PlusIcon } from "lucide-react";
import { useI18n } from "@/locales/client";
import { useQueryState } from "nuqs";
import { Badge } from "@comp/ui/badge";
import { BookOpen, HelpCircle, Clock } from "lucide-react";

interface FAQ {
	questionKey: string;
	answerKey: string;
}

type Props = {
	title: string;
	description: string;
	cta?: string;
	imageSrc: string;
	imageAlt: string;
	faqs?: FAQ[];
	sheetName: string;
};

export function AppOnboarding({
	title,
	description,
	cta,
	imageSrc,
	imageAlt,
	faqs,
	sheetName,
}: Props) {
	const t = useI18n();
	const [open, setOpen] = useQueryState(sheetName);
	const isOpen = Boolean(open);

	return (
		<Card className="w-full overflow-hidden border">
			<div className="flex flex-col lg:min-h-[600px]">
				<div className="p-6 flex-1">
					<div className="flex flex-col max-h-[500px]">
						<CardHeader className="px-0 flex-none space-y-3">
							<div className="flex items-start justify-between">
								<div>
									<div className="flex items-center gap-2 mb-1">
										<CardTitle className="text-2xl font-bold">
											{title}
										</CardTitle>
										<Badge variant="outline" className="ml-2 text-xs">
											New
										</Badge>
									</div>
									<CardDescription className="text-base text-muted-foreground max-w-xl">
										{description}
									</CardDescription>
								</div>
								<Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
									Recommended
								</Badge>
							</div>

							<div className="relative h-1 w-full bg-secondary/50 rounded-full overflow-hidden mt-4">
								<div
									className="h-full bg-primary/80 transition-all"
									style={{ width: "5%" }}
								/>
							</div>
						</CardHeader>

						<CardContent className="px-0 flex-1 overflow-hidden flex flex-col h-full min-h-full pt-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								<div className="flex flex-col">
									<div className="flex items-center gap-2 mb-4">
										<BookOpen className="h-4 w-4 text-primary" />
										<p className="font-medium text-md">
											{t("app_onboarding.risk_management.learn_more")}
										</p>
									</div>

									{faqs && faqs.length > 0 && (
										<Accordion
											type="single"
											collapsible
											className="w-full divide-y"
										>
											{faqs.map((faq) => (
												<AccordionItem
													key={faq.questionKey}
													value={faq.questionKey}
													className="border-b-0 px-0"
												>
													<AccordionTrigger className="py-3 hover:bg-muted/30 px-2">
														<div className="flex items-center gap-2 text-left">
															<HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
															<span>{faq.questionKey}</span>
														</div>
													</AccordionTrigger>
													<AccordionContent className="px-2 ml-6 border-l-2 my-2 border-muted">
														{faq.answerKey}
													</AccordionContent>
												</AccordionItem>
											))}
										</Accordion>
									)}
								</div>

								<div className="flex flex-col items-center justify-center relative hidden lg:flex">
									<div className="absolute inset-0 bg-gradient-radial from-accent/20 to-transparent opacity-70 rounded-full" />
									<Image
										src={imageSrc}
										alt={imageAlt}
										height={350}
										width={350}
										quality={100}
										className="relative z-10 drop-shadow-md"
									/>
								</div>
							</div>
						</CardContent>
					</div>
				</div>

				{cta && (
					<CardFooter className="py-4 bg-muted/30 border-t flex items-center justify-between">
						<div className="flex items-center text-sm text-muted-foreground">
							<Clock className="h-3.5 w-3.5 mr-1.5" />
							<span>Estimated time: ~15 minutes</span>
						</div>
						<Button
							variant="action"
							className="flex items-center gap-2"
							onClick={() => setOpen("true")}
						>
							<PlusIcon className="w-4 h-4" />
							{cta}
						</Button>
					</CardFooter>
				)}
			</div>
		</Card>
	);
}
