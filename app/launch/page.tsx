import { notFound } from "next/navigation";
import { MajorLaunchPage } from "@/components/shared/major-launch-page";
import { getPublicPlatformState } from "@/lib/api/platform";

export const metadata = {
  title: "Launch — XecureCode",
  description: "Something exciting is coming soon.",
};

export default async function LaunchPage() {
  const platform = await getPublicPlatformState();
  const launch = platform.activeLaunch;

  if (!launch || !launch.active) {
    notFound();
  }

  return <MajorLaunchPage launch={launch} signupEnabled={platform.settings.signupEnabled} />;
}
