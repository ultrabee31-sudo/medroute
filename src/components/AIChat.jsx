import { useState } from "react";
import { aiExplain } from "@/lib/api";
import { toast } from "sonner";
import { PaperPlaneRight, Sparkle } from "@phosphor-icons/react";

const QUICK = [
    "Explain the optimal route step-by-step.",
    "Which supplies were loaded and why?",
    "What trade-offs did the optimizer make?",
    "How close is 2-opt to the brute-force optimum?",
];

export default function AIChat({ context }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);

    const send = async (q) => {
        const question = (q ?? input).trim();
        if (!question) return;
        const hasContext =
            context?.plan || context?.tsp || context?.knap;
        if (!hasContext) {
            toast.error("Run the optimizer first so I have data to explain.");
            return;
        }
        setMessages((m) => [...m, { role: "user", text: question }]);
        setInput("");
        setLoading(true);
        try {
            const r = await aiExplain({
                session_id: sessionId,
                context: {
                    summary: context.plan?.summary,
                    tsp: context.tsp
                        ? {
                              nodes: context.tsp.nodes,
                              nn_distance: context.tsp.nearest_neighbor?.distance_km,
                              opt_distance: context.tsp.two_opt?.distance_km,
                              improvement_pct: context.tsp.two_opt?.improvement_pct,
                              tour: context.tsp.two_opt?.tour,
                              brute_force: context.tsp.brute_force,
                          }
                        : null,
                    knap: context.knap
                        ? {
                              capacity: context.knap.capacity,
                              dp: context.knap.dp,
                              items: context.knap.items?.map((it) => ({
                                  name: it.name,
                                  weight_kg: it.weight_kg,
                                  value: it.value,
                                  selected: it.selected_dp,
                              })),
                              brute_force: context.knap.brute_force,
                          }
                        : null,
                },
                question,
            });
            setSessionId(r.session_id);
            setMessages((m) => [...m, { role: "assistant", text: r.response }]);
        } catch (e) {
            const detail = e?.response?.data?.detail || e.message;
            setMessages((m) => [...m, { role: "assistant", text: `⚠️ ${detail}` }]);
            toast.error("AI request failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full" data-testid="ai-chat">
            <div className="p-3 border-b border-slate-200 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[color:var(--mr-accent)] animate-pulse" />
                <span className="overline">MedRoute Copilot · Claude Sonnet 4.5</span>
            </div>
            <div className="flex-1 overflow-y-auto mr-scroll p-3 space-y-3">
                {messages.length === 0 && (
                    <div className="space-y-2">
                        <div className="text-xs text-slate-500 leading-relaxed">
                            Ask anything about the current plan. The assistant receives the
                            optimizer output as structured context.
                        </div>
                        <div className="grid gap-1.5">
                            {QUICK.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => send(q)}
                                    disabled={loading}
                                    className="text-left text-xs border border-slate-200 px-2.5 py-2 hover:bg-slate-50 flex items-start gap-2"
                                    data-testid="ai-quick-prompt"
                                >
                                    <Sparkle
                                        size={12}
                                        weight="fill"
                                        className="mt-0.5 flex-none"
                                        color="var(--mr-accent)"
                                    />
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`text-xs leading-relaxed whitespace-pre-wrap border-l-2 pl-3 py-1 ${
                            m.role === "user"
                                ? "border-slate-900"
                                : "border-[color:var(--mr-accent)]"
                        }`}
                    >
                        <div className="overline mb-1">
                            {m.role === "user" ? "You" : "Copilot"}
                        </div>
                        {m.text}
                    </div>
                ))}
                {loading && (
                    <div className="text-xs text-slate-500 font-mono animate-pulse">thinking…</div>
                )}
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    send();
                }}
                className="flex border-t border-slate-200"
                data-testid="ai-form"
            >
                <input
                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                    placeholder="Ask about this plan…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    data-testid="ai-input"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 bg-slate-900 text-white hover:bg-[color:var(--mr-primary)] transition-colors"
                    data-testid="ai-send-btn"
                >
                    <PaperPlaneRight size={14} weight="fill" />
                </button>
            </form>
        </div>
    );
}
