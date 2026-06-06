"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface JsonViewerProps {
  data: unknown;
  className?: string;
}

function highlight(json: string): React.ReactNode[] {
  // Token regex: strings, numbers, booleans, null, punctuation
  const regex = /("(?:\\.|[^"\\])*")\s*(:)?|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}[\],])/g;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(json)) !== null) {
    // Raw text before match (whitespace, newlines)
    if (match.index > last) {
      nodes.push(json.slice(last, match.index));
    }

    const [full, str, colon, bool_null, num, punct] = match;

    if (str !== undefined) {
      if (colon !== undefined) {
        // Object key
        nodes.push(
          <span key={match.index} className="text-code-fn">{str}</span>,
          <span key={match.index + "c"} className="text-code-muted">:</span>,
        );
      } else {
        // String value
        nodes.push(<span key={match.index} className="text-code-file">{str}</span>);
      }
    } else if (bool_null !== undefined) {
      nodes.push(
        <span key={match.index} className="text-code-keyword">{bool_null}</span>,
      );
    } else if (num !== undefined) {
      nodes.push(
        <span key={match.index} className="text-code-line-col">{num}</span>,
      );
    } else if (punct !== undefined) {
      nodes.push(
        <span key={match.index} className="text-code-muted">{punct}</span>,
      );
    } else {
      nodes.push(full);
    }

    last = match.index + full.length;
  }

  if (last < json.length) nodes.push(json.slice(last));
  return nodes;
}

export function JsonViewer({ data, className }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const json = typeof data === "string"
    ? (() => { try { return JSON.stringify(JSON.parse(data), null, 2); } catch { return data; } })()
    : JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("rounded-xl border border-code-border bg-code-bg overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-code-header border-b border-code-border">
        <span className="text-xs font-medium text-code-label tracking-wide uppercase">JSON</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-code-muted hover:text-code-text transition-colors"
        >
          {copied ? <Check className="size-3 text-code-success" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-xs font-mono leading-relaxed text-code-text">
          {highlight(json)}
        </pre>
      </div>
    </div>
  );
}
