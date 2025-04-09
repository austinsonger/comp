"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Skeleton } from "@comp/ui/skeleton";
import { useI18n } from "@/locales/client";
import { useParams } from "next/navigation";
import { FileSection } from "./FileSection";
import { UrlSection } from "./UrlSection";
import { useEvidence } from "../hooks/useEvidence";

export function EditEvidenceForm() {
	const { evidenceId } = useParams<{ evidenceId: string }>();
	const { data, isLoading, error, mutate } = useEvidence({ id: evidenceId });
	const t = useI18n();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4">
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-60 w-full" />
			</div>
		);
	}

	if (error) {
		return <div>Error</div>;
	}

	const handleMutate = async () => {
		await mutate();
	};

	if (!data?.data) return null;

	const evidence = data.data;

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center justify-between gap-2">
						{t("evidence.details.content")}
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<FileSection
					evidenceId={evidenceId}
					fileUrls={evidence.fileUrls}
					onSuccess={handleMutate}
				/>

				<UrlSection
					evidenceId={evidenceId}
					additionalUrls={evidence.additionalUrls}
					onSuccess={handleMutate}
				/>
			</CardContent>
		</Card>
	);
}
