import { appConfig } from "@/lib/config/app";

export interface PublicPlatformSettings {
  maintenanceMode: boolean;
  maintenanceMessage?: string | null;
  betaMode: boolean;
  signupEnabled: boolean;
  pricingVisible: boolean;
  featureFlags: Record<string, unknown>;
  marketingControls: Record<string, unknown>;
}

export interface PublicAnnouncement {
  id: string;
  title: string;
  message: string;
  audience: string;
  createdAt: string;
}

export interface PublicLaunch {
  id: string;
  title: string;
  subtitle?: string | null;
  features: string[];
  targetDate: string;
  type: "MAJOR" | "MINOR";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicPlatformState {
  settings: PublicPlatformSettings;
  announcement: PublicAnnouncement | null;
  activeLaunch: PublicLaunch | null;
}

const defaultPlatformState: PublicPlatformState = {
  settings: {
    maintenanceMode: false,
    maintenanceMessage: null,
    betaMode: true,
    signupEnabled: true,
    pricingVisible: true,
    featureFlags: {},
    marketingControls: {},
  },
  announcement: null,
  activeLaunch: null,
};

export async function getPublicPlatformState(): Promise<PublicPlatformState> {
  try {
    const response = await fetch(`${appConfig.apiUrl}/api/v1/platform/public`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return defaultPlatformState;
    }

    const body = (await response.json()) as {
      success: boolean;
      data?: PublicPlatformState;
    };

    return body.data ?? defaultPlatformState;
  } catch {
    return defaultPlatformState;
  }
}
