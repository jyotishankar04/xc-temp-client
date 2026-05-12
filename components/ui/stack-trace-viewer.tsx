"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StackTraceViewerProps {
  trace: string;
  maxLines?: number;
  className?: string;
}

type FrameToken =
  | { kind: "error-name"; text: string }
  | { kind: "error-msg"; text: string }
  | { kind: "at"; text: string }
  | { kind: "fn"; text: string }
  | { kind: "file"; text: string }
  | { kind: "line-col"; text: string }
  | { kind: "traceback"; text: string }
  | { kind: "py-file"; text: string }
  | { kind: "py-code"; text: string }
  | { kind: "dim"; text: string }
  | { kind: "raw"; text: string };

const tokenColors: Record<FrameToken["kind"], string> = {
  "error-name":  "text-code-error font-bold",
  "error-msg":   "text-code-error-msg",
  "at":          "text-code-muted",
  "fn":          "text-code-fn",
  "file":        "text-code-file",
  "line-col":    "text-code-line-col",
  "traceback":   "text-code-error/70 italic",
  "py-file":     "text-code-py-file",
  "py-code":     "text-code-text",
  "dim":         "text-code-dim",
  "raw":         "text-code-label",
};

function parseLine(line: string): FrameToken[][] {
  const trimmed = line.trim();

  // Python traceback header
  if (/^Traceback \(most recent call last\):/.test(trimmed)) {
    return [[{ kind: "traceback", text: line }]];
  }

  // Python — File "...", line N, in fn
  const pyFile = line.match(/^(\s+File ")(.+?)(",\s*line\s*)(\d+)(,\s*in\s*)(.+)$/);
  if (pyFile) {
    return [[
      { kind: "dim",     text: pyFile[1]! },
      { kind: "py-file", text: pyFile[2]! },
      { kind: "dim",     text: pyFile[3]! },
      { kind: "line-col", text: pyFile[4]! },
      { kind: "dim",     text: pyFile[5]! },
      { kind: "fn",      text: pyFile[6]! },
    ]];
  }

  // Python — indented code line (4 spaces, under a File line)
  if (/^\s{4}\S/.test(line) && !/^\s+at\s/.test(line)) {
    return [[{ kind: "py-code", text: line }]];
  }

  // Node.js — "ErrorName: message"
  const errorHeader = line.match(/^([A-Za-z$_][\w$.]*(?:Error|Exception|Rejected|Failure|Timeout|Unavailable))\s*:\s*(.*)$/);
  if (errorHeader) {
    return [[
      { kind: "error-name", text: errorHeader[1]! },
      { kind: "dim",        text: ": " },
      { kind: "error-msg",  text: errorHeader[2]! },
    ]];
  }

  // Node.js — "    at fnName (file:line:col)"
  const nodeFrame = line.match(/^(\s+)(at)\s+(.+?)\s+\((.+):(\d+):(\d+)\)(.*)$/);
  if (nodeFrame) {
    const file = nodeFrame[4]!;
    const isDim = /node_modules|node:|internal\/|<anonymous>/.test(file);
    return [[
      { kind: isDim ? "dim" : "at",      text: nodeFrame[1]! + nodeFrame[2]! + " " },
      { kind: isDim ? "dim" : "fn",      text: nodeFrame[3]! },
      { kind: "dim",                     text: " (" },
      { kind: isDim ? "dim" : "file",    text: file },
      { kind: "dim",                     text: ":" },
      { kind: isDim ? "dim" : "line-col", text: nodeFrame[5]! + ":" + nodeFrame[6]! },
      { kind: "dim",                     text: ")" + (nodeFrame[7] ?? "") },
    ]];
  }

  // Node.js — "    at file:line:col" (anonymous)
  const nodeFrameAnon = line.match(/^(\s+)(at)\s+(.+):(\d+):(\d+)$/);
  if (nodeFrameAnon) {
    const file = nodeFrameAnon[3]!;
    const isDim = /node_modules|node:|internal\//.test(file);
    return [[
      { kind: isDim ? "dim" : "at",       text: nodeFrameAnon[1]! + nodeFrameAnon[2]! + " " },
      { kind: isDim ? "dim" : "file",     text: file },
      { kind: "dim",                      text: ":" },
      { kind: isDim ? "dim" : "line-col", text: nodeFrameAnon[4]! + ":" + nodeFrameAnon[5]! },
    ]];
  }

  return [[{ kind: "raw", text: line }]];
}

export function StackTraceViewer({ trace, maxLines = 20, className }: StackTraceViewerProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const lines = trace.split("\n");
  const isLong = lines.length > maxLines;
  const visibleLines = isLong && !expanded ? lines.slice(0, maxLines) : lines;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trace);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("rounded-xl border border-code-border bg-code-bg overflow-hidden", className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-code-header border-b border-code-border">
        <span className="text-xs font-medium text-code-label tracking-wide uppercase">Stack Trace</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-code-muted hover:text-code-text transition-colors"
        >
          {copied ? <Check className="size-3 text-code-success" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Trace lines */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-xs font-mono leading-relaxed">
          {visibleLines.map((line, i) => {
            const tokenGroups = parseLine(line);
            return (
              <div key={i} className="flex">
                {/* Line number gutter */}
                <span className="select-none w-8 shrink-0 text-right mr-4 text-code-gutter tabular-nums">
                  {i + 1}
                </span>
                <span>
                  {tokenGroups[0]!.map((token, j) => (
                    <span key={j} className={tokenColors[token.kind]}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
          {isLong && !expanded && (
            <div className="flex">
              <span className="select-none w-8 shrink-0 mr-4" />
              <span className="text-code-dim italic">
                … {lines.length - maxLines} more lines
              </span>
            </div>
          )}
        </pre>
      </div>

      {/* Expand/collapse */}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-code-muted hover:text-code-text bg-code-header border-t border-code-border transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="size-3" /> Show less</>
          ) : (
            <><ChevronDown className="size-3" /> Show all {lines.length} lines</>
          )}
        </button>
      )}
    </div>
  );
}
