import { redirect } from "next/navigation";

export default async function ServicePage({ params }: { params: Promise<{ serviceId: string }> }) {
  redirect(`/app/dashboard/services/${(await params).serviceId}/overview`);
}
