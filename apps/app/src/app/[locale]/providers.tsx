"use client";

import { I18nProviderClient } from "@/locales/client";
import { AnalyticsProvider } from "@comp/analytics";
import { Session, User } from "better-auth";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { GoogleTagManager } from "@next/third-parties/google";

type ProviderProps = {
	children: ReactNode;
	locale: string;
	session: {
		session: Session | null;
		user: User | null;
	} | null;
};

export function Providers({ children, locale, session }: ProviderProps) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			forcedTheme="dark"
			disableTransitionOnChange
			scriptProps={{ "data-cfasync": "false" }}
		>
			<GoogleTagManager
				gtmId="GTM-56GW3TVW"
				dataLayer={{
					user_id: session?.user?.id ?? "",
					user_email: session?.user?.email ?? "",
				}}
			/>
			<AnalyticsProvider
				userId={session?.user?.id ?? undefined}
				userEmail={session?.user?.email ?? undefined}
			>
				<I18nProviderClient locale={locale}>{children}</I18nProviderClient>
			</AnalyticsProvider>
		</ThemeProvider>
	);
}
