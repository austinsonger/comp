"use client";

import { useEffect } from "react";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(
			"app/[locale]/(app)/(dashboard)/[orgId]/frameworks/error.tsx",
			error,
		);
	}, [error]);

	return (
		<div>
			<h2>Something went wrong!</h2>
			<button onClick={reset} type="button">
				Try again
			</button>
		</div>
	);
}
