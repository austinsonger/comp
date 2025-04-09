"use client";

import { createPolicyAction } from "@/actions/policies/create-new-policy";
import { createPolicySchema } from "@/actions/schema";
import { useI18n } from "@/locales/client";
import { Button } from "@comp/ui/button";
import { Textarea } from "@comp/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useQueryState } from "nuqs";
import { Input } from "@comp/ui/input";
import { ArrowRightIcon } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@comp/ui/accordion";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@comp/ui/form";
import React from "react";

export function CreateNewPolicyForm() {
	const t = useI18n();
	const [_, setCreatePolicySheet] = useQueryState("create-policy-sheet");

	const createPolicy = useAction(createPolicyAction, {
		onSuccess: () => {
			toast.success(t("policies.new.success"));
			setCreatePolicySheet(null);
		},
		onError: () => {
			toast.error(t("policies.new.error"));
		},
	});

	const form = useForm<z.infer<typeof createPolicySchema>>({
		resolver: zodResolver(createPolicySchema),
		defaultValues: {
			title: "",
			description: "",
			frameworkIds: [],
			controlIds: [],
		},
	});

	const onSubmit = (data: z.infer<typeof createPolicySchema>) => {
		createPolicy.execute(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="h-[calc(100vh-250px)] scrollbar-hide overflow-auto">
					<div>
						<Accordion type="multiple" defaultValue={["policy"]}>
							<AccordionItem value="policy">
								<AccordionTrigger>{t("policies.new.details")}</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t("policies.new.title")}</FormLabel>
													<FormControl>
														<Input
															{...field}
															autoFocus
															className="mt-3"
															placeholder={t("policies.new.title")}
															autoCorrect="off"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{t("policies.new.description")}</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															className="mt-3 min-h-[80px]"
															placeholder={t("policies.new.description")}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
					<div className="flex justify-end mt-4">
						<Button
							type="submit"
							variant="action"
							disabled={createPolicy.status === "executing"}
						>
							<div className="flex items-center justify-center">
								{t("common.actions.create")}
								<ArrowRightIcon className="ml-2 h-4 w-4" />
							</div>
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
