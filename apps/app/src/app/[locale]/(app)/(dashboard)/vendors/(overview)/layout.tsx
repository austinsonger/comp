import { getI18n } from "@/locales/server";
import { SecondaryMenu } from "@bubba/ui/secondary-menu";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getI18n();

  return (
    <div className="max-w-[1200px]">
      <SecondaryMenu
        items={[
          { path: "/vendors", label: t("risk.overview") },
          { path: "/vendors/register", label: t("vendor.register_title") },
        ]}
      />

      <main className="mt-8">{children}</main>
    </div>
  );
}
