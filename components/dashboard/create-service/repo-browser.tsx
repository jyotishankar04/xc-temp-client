"use client";

import { useMemo, useState } from "react";
import { Check, Github, Lock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks";
import type { GitHubRepo } from "@/lib/types/service";

export function RepoBrowser({
  repos,
  selectedRepo,
  onSelect,
}: {
  repos: GitHubRepo[];
  selectedRepo: GitHubRepo | null;
  onSelect: (repo: GitHubRepo) => void;
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 160);

  const groupedRepos = useMemo(() => {
    const needle = debouncedQuery.trim().toLowerCase();
    const filtered = repos.filter((repo) => {
      if (!needle) return true;
      return (
        repo.name.toLowerCase().includes(needle) ||
        repo.fullName.toLowerCase().includes(needle) ||
        repo.language?.toLowerCase().includes(needle)
      );
    });

    return filtered.reduce<Record<string, GitHubRepo[]>>((acc, repo) => {
      const owner = repo.owner ?? repo.fullName.split("/")[0] ?? "Repositories";
      acc[owner] ??= [];
      acc[owner].push(repo);
      return acc;
    }, {});
  }, [debouncedQuery, repos]);

  const groups = Object.entries(groupedRepos);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search repositories..."
          className="pl-9"
        />
      </div>

      <div className="max-h-[420px] overflow-y-auto rounded-md border">
        {groups.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No repositories match your search.
          </div>
        ) : (
          groups.map(([owner, ownerRepos]) => (
            <div key={owner}>
              <div className="sticky top-0 z-10 border-b bg-muted/70 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur">
                {owner}
              </div>
              {ownerRepos.map((repo) => {
                const isSelected = selectedRepo?.id === repo.id;
                return (
                  <button
                    key={repo.id}
                    type="button"
                    onClick={() => onSelect(repo)}
                    className={cn(
                      "flex w-full items-center gap-3 border-b px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/60",
                      isSelected && "bg-primary/5 ring-1 ring-inset ring-primary"
                    )}
                  >
                    <Github className="size-5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{repo.fullName}</p>
                        {repo.private && (
                          <Badge variant="secondary" className="gap-1 text-[10px]">
                            <Lock className="size-3" />
                            Private
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {repo.language ?? "Unknown"} · {repo.defaultBranch}
                        {repo.description ? ` · ${repo.description}` : ""}
                      </p>
                    </div>
                    {isSelected && <Check className="size-4 shrink-0 text-primary" />}
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
