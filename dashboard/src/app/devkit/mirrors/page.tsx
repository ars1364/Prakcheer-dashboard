"use client";

interface Mirror {
  name:     string;
  type:     "apt" | "pip" | "npm" | "docker" | "go" | "helm";
  url:      string;
  region:   string;
  latency:  number;
  uptime:   number;
  status:   "online" | "degraded" | "offline";
}

const MIRRORS: Mirror[] = [
  { name: "APT Mirror تهران-۱",   type: "apt",    url: "https://apt.mirror.prakcheer.ir",    region: "تهران-۱",   latency: 3,   uptime: 99.9, status: "online"   },
  { name: "PyPI Mirror تهران-۱",  type: "pip",    url: "https://pypi.mirror.prakcheer.ir",   region: "تهران-۱",   latency: 4,   uptime: 99.8, status: "online"   },
  { name: "NPM Mirror تهران-۱",   type: "npm",    url: "https://npm.mirror.prakcheer.ir",    region: "تهران-۱",   latency: 5,   uptime: 99.7, status: "online"   },
  { name: "Docker Hub Mirror",    type: "docker", url: "https://docker.mirror.prakcheer.ir", region: "تهران-۱",   latency: 8,   uptime: 99.5, status: "online"   },
  { name: "Go Proxy تهران-۱",     type: "go",     url: "https://goproxy.prakcheer.ir",       region: "تهران-۱",   latency: 6,   uptime: 99.6, status: "online"   },
  { name: "Helm Mirror",          type: "helm",   url: "https://helm.mirror.prakcheer.ir",   region: "تهران-۱",   latency: 7,   uptime: 98.2, status: "degraded" },
  { name: "APT Mirror مشهد-۱",    type: "apt",    url: "https://apt-mhd.mirror.prakcheer.ir",region: "مشهد-۱",    latency: 12,  uptime: 99.1, status: "online"   },
  { name: "Docker Mirror مشهد-۱", type: "docker", url: "https://docker-mhd.mirror.prakcheer.ir",region:"مشهد-۱", latency: 15,  uptime: 97.3, status: "degraded" },
];

const TYPE_CONFIGS: Record<string, { label: string; config: string }> = {
  apt:    { label: "APT",    config: 'echo "deb https://apt.mirror.prakcheer.ir/ubuntu jammy main" | sudo tee /etc/apt/sources.list' },
  pip:    { label: "PyPI",   config: 'pip install -i https://pypi.mirror.prakcheer.ir/simple/ <package>' },
  npm:    { label: "NPM",    config: 'npm config set registry https://npm.mirror.prakcheer.ir' },
  docker: { label: "Docker", config: '{"registry-mirrors": ["https://docker.mirror.prakcheer.ir"]}' },
  go:     { label: "Go",     config: 'GOPROXY=https://goproxy.prakcheer.ir,direct go get ...' },
  helm:   { label: "Helm",   config: 'helm repo add stable https://helm.mirror.prakcheer.ir/stable' },
};

const STATUS_STYLE: Record<string, string> = {
  online:   "bg-green-100 text-green-700",
  degraded: "bg-amber-100 text-amber-700",
  offline:  "bg-red-100 text-red-700",
};

const TYPE_COLOR: Record<string, string> = {
  apt: "#d97706", pip: "#2554d8", npm: "#dc2626",
  docker: "#0891b2", go: "#16a34a", helm: "#7c3aed",
};

export default function MirrorsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">Mirror‌های Package</h1>
            <p className="text-[12px] text-text-muted mt-2">آینه‌های داخلی برای سریع‌تر کردن دانلود پکیج‌ها</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل mirror",    value: MIRRORS.length,                                    color: "#2554d8" },
            { label: "آنلاین",       value: MIRRORS.filter((m) => m.status === "online").length,   color: "#16a34a" },
            { label: "degraded",     value: MIRRORS.filter((m) => m.status === "degraded").length, color: "#d97706" },
            { label: "میانگین تأخیر",value: Math.round(MIRRORS.reduce((a, m) => a + m.latency, 0) / MIRRORS.length) + "ms", color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {MIRRORS.map((m) => (
          <div key={m.url} className="glass rounded-14 p-16 border border-border">
            <div className="flex items-start justify-between gap-12 mb-10">
              <div className="flex items-center gap-10">
                <span className="px-8 py-3 rounded-5 text-[11px] font-bold" style={{ background: `${TYPE_COLOR[m.type]}20`, color: TYPE_COLOR[m.type] }}>
                  {TYPE_CONFIGS[m.type]?.label ?? m.type}
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-text-main">{m.name}</p>
                  <p className="text-[11px] font-mono text-brand ltr-text mt-2" style={{ direction: "ltr" }}>{m.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 shrink-0">
                <span className="text-[11px] text-text-muted">{m.latency}ms</span>
                <span className="text-[11px] text-text-muted">{m.uptime}٪</span>
                <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${STATUS_STYLE[m.status]}`}>
                  {m.status === "online" ? "آنلاین" : m.status === "degraded" ? "ناپایدار" : "آفلاین"}
                </span>
              </div>
            </div>
            <div className="bg-bg rounded-8 p-10 ltr-text" style={{ direction: "ltr" }}>
              <pre className="text-[11px] font-mono text-text-muted">{TYPE_CONFIGS[m.type]?.config}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
