function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 border-r bg-card min-h-screen p-4">
          <h2 className="font-semibold text-lg mb-4">Dashboard</h2>
          <nav className="space-y-2">
            <a href="/dashboard/overview" className="block p-2 rounded hover:bg-muted">
              Overview
            </a>
            <a href="/dashboard/incidents" className="block p-2 rounded hover:bg-muted">
              Incidents
            </a>
            <a href="/dashboard/settings" className="block p-2 rounded hover:bg-muted">
              Settings
            </a>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
