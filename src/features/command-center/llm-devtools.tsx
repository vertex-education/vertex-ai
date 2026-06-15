import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Bug, Maximize2, Minimize2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type LlmDevTrace } from "@/lib/pmo-data";

export type LlmDevtoolsPane = "request" | "response" | "thinking" | "raw";

export function LlmDevtools({ traces }: { traces: LlmDevTrace[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);
  const [activePane, setActivePane] = useState<LlmDevtoolsPane>("request");
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const devtoolsPanelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!selectedTraceId && traces[0]) setSelectedTraceId(traces[0].id);
    if (selectedTraceId && traces.length > 0 && !traces.some((trace) => trace.id === selectedTraceId)) {
      setSelectedTraceId(traces[0].id);
    }
  }, [selectedTraceId, traces]);

  const selectedTrace = traces.find((trace) => trace.id === selectedTraceId) ?? traces[0] ?? null;
  const panes: Array<{ id: LlmDevtoolsPane; label: string }> = [
    { id: "request", label: "Request" },
    { id: "response", label: "Response" },
    { id: "thinking", label: "Thinking" },
    { id: "raw", label: "Raw" },
  ];
  function handleResizeStart(event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const panel = devtoolsPanelRef.current;
    resizeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      width: panel?.offsetWidth ?? 760,
      height: panel?.offsetHeight ?? 520,
    };
  }

  function handleResizeMove(event: PointerEvent<HTMLButtonElement>) {
    const start = resizeStartRef.current;
    if (!start) return;
    const panel = devtoolsPanelRef.current;
    if (!panel) return;
    const width = Math.min(Math.max(start.width + start.x - event.clientX, 340), Math.max(340, window.innerWidth - 32));
    const height = Math.min(Math.max(start.height + start.y - event.clientY, 320), Math.max(320, window.innerHeight - 32));
    panel.style.width = `${width}px`;
    panel.style.height = `${height}px`;
  }

  function handleResizeEnd(event: PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resizeStartRef.current = null;
  }

  if (!isOpen) {
    return (
      <button
        aria-label="Open LLM devtools"
        className="fixed right-4 bottom-4 z-50 grid size-11 place-items-center rounded-md border bg-card text-foreground shadow-lg transition-colors hover:bg-accent"
        type="button"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
      >
        <Bug className="size-5" />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs font-semibold shadow-lg">
        <Bug className="size-4" />
        <span>LLM Devtools</span>
        {traces.length ? <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">{traces.length}</span> : null}
        <Button type="button" variant="ghost" size="icon" aria-label="Restore LLM devtools" onClick={() => setIsMinimized(false)}>
          <Maximize2 className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Close LLM devtools" onClick={() => setIsOpen(false)}>
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <section
      ref={devtoolsPanelRef}
      aria-label="LLM devtools"
      className="fixed right-4 bottom-4 z-50 flex h-[520px] max-h-[calc(100vh-2rem)] min-h-80 w-[760px] max-w-[calc(100vw-2rem)] min-w-85 flex-col overflow-hidden rounded-md border bg-card text-card-foreground shadow-2xl"
    >
      <button
        aria-label="Resize LLM devtools"
        className="absolute left-0 top-0 z-10 grid size-7 cursor-nwse-resize place-items-center rounded-br-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        type="button"
        onPointerDown={handleResizeStart}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeEnd}
        onPointerCancel={handleResizeEnd}
      >
        <Maximize2 className="size-3 -rotate-90" />
      </button>
      <header className="flex items-center gap-3 border-b bg-muted/60 py-2 pl-8 pr-3">
        <Bug className="size-4 text-primary" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">LLM Devtools</h2>
          <p className="truncate text-xs text-muted-foreground">
            {selectedTrace
              ? `${selectedTrace.model} / ${selectedTrace.chatTitle} / ${selectedTrace.durationMs}ms`
              : "No LLM calls captured yet"}
          </p>
        </div>
        <Button type="button" variant="ghost" size="icon" aria-label="Minimize LLM devtools" onClick={() => setIsMinimized(true)}>
          <Minimize2 className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Close LLM devtools" onClick={() => setIsOpen(false)}>
          <X className="size-4" />
        </Button>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)]">
        <aside className="min-h-0 overflow-y-auto border-r bg-muted/25 p-2">
          {traces.length ? (
            traces.map((trace) => (
              <button
                className={cn(
                  "mb-2 block w-full rounded-md border bg-background p-2 text-left text-xs transition-colors hover:border-primary/50",
                  selectedTrace?.id === trace.id && "border-primary bg-accent/60",
                )}
                key={trace.id}
                type="button"
                onClick={() => setSelectedTraceId(trace.id)}
              >
                <span className="block truncate font-semibold">{trace.chatTitle}</span>
                <span className="block truncate text-muted-foreground">
                  {new Date(trace.timestamp).toLocaleTimeString()} / {trace.durationMs}ms
                </span>
                {trace.error ? <span className="mt-1 block truncate text-destructive">{trace.error}</span> : null}
              </button>
            ))
          ) : (
            <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
              Send a chat message to capture the Gemma request and response.
            </p>
          )}
        </aside>

        <div className="flex min-h-0 flex-col">
          <div className="flex flex-wrap gap-1 border-b p-2">
            {panes.map((pane) => (
              <button
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  activePane === pane.id && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
                key={pane.id}
                type="button"
                onClick={() => setActivePane(pane.id)}
              >
                {pane.label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-3">
            {selectedTrace ? (
              <LlmDevtoolsPaneContent pane={activePane} trace={selectedTrace} />
            ) : (
              <p className="text-sm text-muted-foreground">No trace selected.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LlmDevtoolsPaneContent({ pane, trace }: { pane: LlmDevtoolsPane; trace: LlmDevTrace }) {
  if (pane === "request") {
    return (
      <div className="space-y-3">
        {trace.request.messages.map((message, index) => (
          <article className="rounded-md border bg-background p-3" key={`${message.role}-${index}`}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="rounded bg-muted px-2 py-1 text-xs font-semibold uppercase text-muted-foreground">{message.role}</span>
              <span className="text-xs text-muted-foreground">{message.content.length.toLocaleString()} chars</span>
            </div>
            <pre className="whitespace-pre-wrap wrap-break-word font-mono text-xs leading-relaxed">{message.content}</pre>
          </article>
        ))}
        <pre className="rounded-md border bg-muted/30 p-3 font-mono text-xs">
          {JSON.stringify(
            {
              max_completion_tokens: trace.request.max_completion_tokens,
              reasoningLevel: trace.request.reasoningLevel,
              reasoning_effort: trace.request.reasoning_effort,
              webSearch: trace.webSearch,
              timeoutMs: trace.request.timeoutMs,
              temperature: trace.request.temperature,
            },
            null,
            2,
          )}
        </pre>
      </div>
    );
  }

  if (pane === "response") {
    return (
      <div className="space-y-3">
        <LlmTraceDiagnostics trace={trace} />
        <pre className="whitespace-pre-wrap wrap-break-word rounded-md border bg-background p-3 font-mono text-xs leading-relaxed">
          {trace.responseText}
        </pre>
      </div>
    );
  }

  if (pane === "thinking") {
    return (
      <div className="space-y-3">
        <LlmTraceDiagnostics trace={trace} />
        {trace.thinkingText ? (
          <pre className="whitespace-pre-wrap wrap-break-word rounded-md border bg-background p-3 font-mono text-xs italic leading-relaxed">
            {trace.thinkingText}
          </pre>
        ) : trace.rawResponse &&
          typeof trace.rawResponse === "object" &&
          !Array.isArray(trace.rawResponse) &&
          trace.rawResponse.streamed === true ? (
          <p className="rounded-md border border-dashed p-3 text-sm italic text-muted-foreground">
            Streaming traces capture the final response text, but this provider stream does not expose a separate thinking field.
          </p>
        ) : (
          <p className="rounded-md border border-dashed p-3 text-sm italic text-muted-foreground">
            No thinking or reasoning field was returned by this model response.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <LlmTraceDiagnostics trace={trace} />
      <pre className="whitespace-pre-wrap wrap-break-word rounded-md border bg-background p-3 font-mono text-xs leading-relaxed">
        {JSON.stringify(trace.rawResponse, null, 2)}
      </pre>
    </div>
  );
}

export function LlmTraceDiagnostics({ trace }: { trace: LlmDevTrace }) {
  return (
    <div className="grid gap-2 rounded-md border bg-muted/30 p-3 text-xs sm:grid-cols-2">
      <span>
        <strong className="block text-muted-foreground">Finish reason</strong>
        {trace.diagnostics.finishReason ?? "Not returned"}
      </span>
      <span>
        <strong className="block text-muted-foreground">Duration</strong>
        {trace.durationMs}ms
      </span>
      <span>
        <strong className="block text-muted-foreground">Response chars</strong>
        {trace.diagnostics.responseTextChars.toLocaleString()}
      </span>
      <span>
        <strong className="block text-muted-foreground">Thinking chars</strong>
        {trace.diagnostics.thinkingTextChars.toLocaleString()}
      </span>
      <span className="sm:col-span-2">
        <strong className="block text-muted-foreground">Web search</strong>
        {trace.webSearch?.enabled
          ? `${trace.webSearch.provider}: ${trace.webSearch.results.length} result${trace.webSearch.results.length === 1 ? "" : "s"}${trace.webSearch.error ? ` (${trace.webSearch.error})` : ""}`
          : "Off"}
      </span>
      <span className="sm:col-span-2">
        <strong className="block text-muted-foreground">Usage</strong>
        {trace.diagnostics.usage ? <code className="wrap-break-word">{JSON.stringify(trace.diagnostics.usage)}</code> : "Not returned"}
      </span>
      {trace.diagnostics.finishReason === "length" ? (
        <span className="rounded-md border border-warning/40 bg-warning/10 p-2 text-warning sm:col-span-2">
          The model stopped because the completion token limit was reached.
        </span>
      ) : null}
    </div>
  );
}
