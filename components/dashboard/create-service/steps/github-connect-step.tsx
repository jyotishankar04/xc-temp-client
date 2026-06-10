"use client";

import { ArrowRight, Github, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGitHubRepos, useGitHubStatus } from "@/lib/hooks";
import { useCreateServiceWizard } from "../create-service-provider";
import { RepoBrowser } from "../repo-browser";

export function GitHubConnectStep() {
  const { data: gitHubStatus, isLoading: isStatusLoading } = useGitHubStatus();
  const isConnected = !!gitHubStatus?.connected;
  const { data: repos = [], isLoading: isReposLoading } = useGitHubRepos(isConnected);
  const { state, updateState, goNext, connectGitHub, isSubmitting, canContinue } =
    useCreateServiceWizard();
  const accountLabel = gitHubStatus?.org ? `Connected as ${gitHubStatus.org}` : "GitHub connected";

  const changeAccountButton = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={connectGitHub}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <Loader2 className="mr-2 size-3.5 animate-spin" />
      ) : (
        <RefreshCw className="mr-2 size-3.5" />
      )}
      Change account
    </Button>
  );

  if (isStatusLoading) {
    return (
      <Card>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Github className="size-7" />
          </div>
          <h2 className="text-balance mt-5 text-xl font-semibold">Connect GitHub to continue</h2>
          <p className="text-pretty mt-2 max-w-md text-sm text-muted-foreground">
            XecureCode needs repository metadata to map this service to its source,
            deployment branch, and rollback workflow.
          </p>
          <Button
            className="mt-6"
            onClick={connectGitHub}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Github className="mr-2 size-4" />
            )}
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isReposLoading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-balance text-lg font-semibold">Fetching repositories</h2>
              <p className="text-pretty mt-1 text-sm text-muted-foreground">
                {accountLabel}. You can switch GitHub accounts before choosing a repository.
              </p>
            </div>
            {changeAccountButton}
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (repos.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <Github className="mx-auto size-10 text-muted-foreground" />
          <h2 className="text-balance mt-4 text-lg font-semibold">No repositories found</h2>
          <p className="text-pretty mt-2 text-sm text-muted-foreground">
            Create a repository on GitHub or check the permissions granted to XecureCode.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            {changeAccountButton}
            <Button asChild variant="outline">
              <a href="https://github.com/new" target="_blank" rel="noreferrer">
                Create repository
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-balance text-lg font-semibold">Choose repository</h2>
            <p className="text-pretty mt-1 text-sm text-muted-foreground">
              Select the repository that backs this production service.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{accountLabel}</p>
          </div>
          {changeAccountButton}
        </div>
        <RepoBrowser
          repos={repos}
          selectedRepo={state.selectedRepo}
          onSelect={(repo) =>
            updateState({
              selectedRepo: repo,
              name: state.name || repo.name,
              defaultBranch: repo.defaultBranch,
            })
          }
        />
        <div className="flex justify-end">
          <Button onClick={goNext} disabled={!canContinue}>
            Continue
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
