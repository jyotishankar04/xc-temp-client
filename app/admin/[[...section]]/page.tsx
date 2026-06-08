import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section = [] } = await params;
  return <AdminPanel section={section[0] ?? "overview"} />;
}
