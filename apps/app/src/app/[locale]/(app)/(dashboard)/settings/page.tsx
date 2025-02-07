import { auth } from "@/auth";
import { DeleteOrganization } from "@/components/forms/organization/delete-organization";
import { UpdateOrganizationName } from "@/components/forms/organization/update-organization-name";
import { UpdateOrganizationWebsite } from "@/components/forms/organization/update-organization-website";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Organization Settings | Comp AI",
};

export default async function OrganizationSettings() {
  const session = await auth();

  const [organization] = await Promise.all([
    db.organization.findUnique({
      where: {
        id: session?.user.organizationId,
      },
      select: {
        name: true,
        website: true,
        id: true,
      },
    }),
  ]);

  if (!organization) {
    return redirect("/");
  }

  return (
    <div className="space-y-12">
      <UpdateOrganizationName organizationName={organization.name} />
      <UpdateOrganizationWebsite organizationWebsite={organization.website} />
      <DeleteOrganization organizationId={organization.id} />
    </div>
  );
}
