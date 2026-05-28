"use client";

import { useState } from "react";

const EVENT_PAYLOADS: Record<string, string> = {
  "instance.created": JSON.stringify({ event: "instance.created", id: "vm-test-01", flavor: "c2.large", region: "تهران-۱", ts: "2025-04-27T14:32:00Z" }, null, 2),
  "instance.deleted": JSON.stringify({ event: "instance.deleted", id: "vm-test-01", reason: "user_request", ts: "2025-04-27T15:00:00Z" }, null, 2),
  "alert.fired":      JSON.stringify({ event: "alert.fired", resource: "vm-prod-01", metric: "cpu_usage", value: 97.3, threshold: 90, severity: "critical", ts: "2025-04-27T11:15:00Z" }, null, 2),
  "payment.success":  JSON.stringify({ event: "payment.success", invoice_id: "inv-2405-0012", amount: 2400000, currency: "IRR", ts: "2025-04-27T13:55:00Z" }, null, 2),
  "payment.failed":   JSON.stringify({ event: "payment.failed", invoice_id: "inv-2405-0011", amount: 1200000, error: "card_declined", ts: "2025-04-27T18:00:00Z" }, null, 2),
  "k8s.cluster.ready":JSON.stringify({ event: "k8s.cluster.ready", cluster: "cluster-main", nodes: 3, version: "1.29.4", ts: "2025-04-27T12:44:00Z" }, null, 2),
};

interface DeliveryResult {
  status:     number;
  duration:   number;
  response:   string;
  ts:         string;
}

export default function TestWebhookPage() {
  const [url, setUrl]       = useState("");
  const [event, setEvent]   = useState("instance.created");
  const [payload, setPayload] = useState(EVENT_PAYLOADS["instance.created"]);
  const [sending, setSending] = useState(false);
  const [result, setResult]  = useState<DeliveryResult | null>(null);
  const [history, setHistory] = useState<(DeliveryResult & { event: string; url: string })[]>([]);

  const handleEventChange = (e: string) => {
    setEvent(e);
    setPayload(EVENT_PAYLOADS[e] ?? "{}");
  };

  const send = async () => {
    if (!url) return;
    setSending(true);
    setResult(null);
    const start = Date.now();
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
    const ok      = Math.random() > 0.2;
    const res: DeliveryResult = {
      status:   ok ? 200 : (Math.random() > 0.5 ? 404 : 500),
      duration: Date.now() - start,
      response: ok ? '{"ok":true}' : '{"error":"not found"}',
      ts:       new Date().toLocaleTimeString("fa-IR"),
    };
    setResult(res);
    setHistory((h) => [{ ...res, event, url }, ...h.slice(0, 9)]);
    setSending(false);
  };

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <h1 className="text-[18px] font-bold text-text-main mb-2">تست Webhook</h1>
        <p className="text-[12px] text-text-muted">ارسال رویداد آزمایشی به آدرس دلخواه</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="glass rounded-16 p-20 flex flex-col gap-14">
          <h2 className="text-[14px] font-bold text-text-main">تنظیمات</h2>
          <div>
            <label className="text-[11px] text-text-muted mb-4 block">آدرس URL مقصد</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/webhook" dir="ltr"
              className="w-full px-12 py-8 rounded-8 border border-border bg-bg text-[12px] outline-none focus:border-brand" />
          </div>
          <div>
            <label className="text-[11px] text-text-muted mb-4 block">نوع رویداد</label>
            <select value={event} onChange={(e) => handleEventChange(e.target.value)}
              className="w-full px-12 py-8 rounded-8 border border-border bg-bg text-[12px] outline-none focus:border-brand">
              {Object.keys(EVENT_PAYLOADS).map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-text-muted mb-4 block">payload (قابل ویرایش)</label>
            <textarea value={payload} onChange={(e) => setPayload(e.target.value)} rows={10} dir="ltr"
              className="w-full px-12 py-8 rounded-8 border border-border bg-bg text-[11px] font-mono outline-none focus:border-brand resize-none" />
          </div>
          <button onClick={send} disabled={!url || sending}
            className="px-16 py-10 rounded-8 bg-brand text-white text-[13px] font-medium disabled:opacity-40 hover:bg-brand/90 transition-colors">
            {sending ? "در حال ارسال..." : "ارسال"}
          </button>

          {result && (
            <div className={`rounded-10 p-14 border ${result.status === 200 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
              <div className="flex items-center gap-10 mb-8">
                <span className={`text-[14px] font-bold ${result.status === 200 ? "text-green-700" : "text-red-700"}`}>{result.status}</span>
                <span className="text-[11px] text-text-muted">{result.duration}ms</span>
                <span className="text-[11px] text-text-muted">{result.ts}</span>
              </div>
              <pre className="text-[11px] font-mono ltr-text" style={{ direction: "ltr" }}>{result.response}</pre>
            </div>
          )}
        </div>

        <div className="glass rounded-16 p-20 flex flex-col gap-12">
          <h2 className="text-[14px] font-bold text-text-main">تاریخچه ارسال</h2>
          {history.length === 0 && <p className="text-[12px] text-text-muted">هنوز ارسالی انجام نشده</p>}
          {history.map((h, i) => (
            <div key={i} className={`rounded-10 p-12 border ${h.status === 200 ? "border-green-100 bg-green-50/50" : "border-red-100 bg-red-50/50"}`}>
              <div className="flex items-center gap-8 flex-wrap">
                <span className={`text-[12px] font-bold ${h.status === 200 ? "text-green-700" : "text-red-700"}`}>{h.status}</span>
                <span className="text-[10px] font-mono text-brand">{h.event}</span>
                <span className="text-[10px] text-text-muted ltr-text truncate flex-1" style={{ direction: "ltr" }}>{h.url}</span>
                <span className="text-[10px] text-text-muted shrink-0">{h.duration}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
