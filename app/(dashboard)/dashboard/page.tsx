"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardStats {
  totalServices: number;
  activeIncidents: number;
  resolvedToday: number;
  avgResponseTime: string;
}

interface Incident {
  id: string;
  serviceId: string;
  serviceName?: string;
  status: string;
  severity: string;
  fingerprint?: string;
  firstSeenAt: string;
}

interface Service {
  id: string;
  name: string;
  env: string;
}

const severityColors: Record<string, string> = {
  HIGH: "bg-red-500/10 text-red-500 border-red-500/20",
  MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  LOW: "bg-green-500/10 text-green-500 border-green-500/20",
};

const statusColors: Record<string, string> = {
  OPEN: "bg-red-500",
  INVESTIGATING: "bg-yellow-500",
  RESOLVED: "bg-green-500",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
        
        const [statsRes, casesRes, servicesRes] = await Promise.all([
          fetch(`${baseUrl}/dashboard/stats`, { credentials: "include" }),
          fetch(`${baseUrl}/cases?limit=5`, { credentials: "include" }),
          fetch(`${baseUrl}/services`, { credentials: "include" }),
        ]);

        const [statsData, casesData, servicesData] = await Promise.all([
          statsRes.json(),
          casesRes.json(),
          servicesRes.json(),
        ]);

        if (statsData.success) setStats(statsData.data);
        if (casesData.success) setIncidents(casesData.data || []);
        if (servicesData.success) setServices(servicesData.data || []);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const defaultStats = {
    totalServices: services.length,
    activeIncidents: 0,
    resolvedToday: 0,
    avgResponseTime: "0m",
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your services and incidents</p>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Services</p>
                <p className="text-2xl font-bold mt-1">{displayStats.totalServices}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Incidents</p>
                <p className="text-2xl font-bold mt-1">{displayStats.activeIncidents}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
                <p className="text-2xl font-bold mt-1">{displayStats.resolvedToday}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold mt-1">{displayStats.avgResponseTime}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>Latest errors across your services</CardDescription>
            </div>
            <Link href="/dashboard/cases">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No recent incidents</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium font-mono">
                          {incident.id.slice(0, 8)}
                        </span>
                        <Badge className={severityColors[incident.severity] || severityColors.LOW}>
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {incident.fingerprint || "Unknown error"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {new Date(incident.firstSeenAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${statusColors[incident.status] || statusColors.OPEN}`} />
                      <span className="text-xs text-muted-foreground">{incident.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Services Health</CardTitle>
              <CardDescription>Current status of your services</CardDescription>
            </div>
            <Link href="/dashboard/services">
              <Button variant="ghost" size="sm" className="gap-1">
                Manage <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4" />
                <p>No services configured</p>
                <Link href="/dashboard/services">
                  <Button variant="outline" size="sm" className="mt-4">
                    Add Service
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {services.slice(0, 5).map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.env}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}