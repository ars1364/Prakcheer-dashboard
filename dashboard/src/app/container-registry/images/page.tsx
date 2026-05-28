"use client";

import Link from "next/link";

interface Image {
  repo:     string;
  tag:      string;
  digest:   string;
  size:     string;
  pushed:   string;
  platform: string;
  vulns:    number;
}

const IMAGES: Image[] = [
  { repo: "api",  tag: "v2.4.1",      digest: "sha256:a1b2c3d4",  size: "248 MB", pushed: "۲ ساعت پیش",  platform: "linux/amd64", vulns: 0  },
  { repo: "api",  tag: "v2.4.0",      digest: "sha256:e5f6g7h8",  size: "245 MB", pushed: "۳ روز پیش",   platform: "linux/amd64", vulns: 2  },
  { repo: "api",  tag: "v2.3.5",      digest: "sha256:i9j0k1l2",  size: "240 MB", pushed: "۱ هفته پیش",  platform: "linux/amd64", vulns: 5  },
  { repo: "api",  tag: "latest",      digest: "sha256:a1b2c3d4",  size: "248 MB", pushed: "۲ ساعت پیش",  platform: "linux/amd64", vulns: 0  },
  { repo: "worker", tag: "v2.4.1",    digest: "sha256:m3n4o5p6",  size: "190 MB", pushed: "۲ ساعت پیش",  platform: "linux/amd64", vulns: 0  },
  { repo: "worker", tag: "v2.4.0",    digest: "sha256:q7r8s9t0",  size: "188 MB", pushed: "۳ روز پیش",   platform: "linux/amd64", vulns: 1  },
  { repo: "worker", tag: "latest",    digest: "sha256:m3n4o5p6",  size: "190 MB", pushed: "۲ ساعت پیش",  platform: "linux/amd64", vulns: 0  },
  { repo: "ml-trainer", tag: "v1.2",  digest: "sha256:u1v2w3x4",  size: "4.5 GB", pushed: "۳ روز پیش",   platform: "linux/amd64", vulns: 3  },
];

export default function ImagesPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">Image‌ها</h1>
            <p className="text-[12px] text-text-muted mt-2">لیست تمام image‌های Docker</p>
          </div>
          <Link href="/container-registry/repositories" className="text-[12px] text-text-muted hover:text-brand">← مخازن</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل image",   value: IMAGES.length,                                         color: "#2554d8" },
            { label: "بدون آسیب", value: IMAGES.filter((i) => i.vulns === 0).length,            color: "#16a34a" },
            { label: "آسیب‌پذیر", value: IMAGES.filter((i) => i.vulns > 0).length,             color: "#dc2626" },
            { label: "latest tag", value: IMAGES.filter((i) => i.tag === "latest").length,       color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">مخزن:tag</th>
              <th className="text-start py-12 font-medium">digest</th>
              <th className="text-start py-12 font-medium">حجم</th>
              <th className="text-start py-12 font-medium">platform</th>
              <th className="text-start py-12 font-medium">آسیب‌پذیری</th>
              <th className="text-start py-12 font-medium">push شده</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {IMAGES.map((img) => (
              <tr key={img.repo + img.tag} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-mono text-[11px] ltr-text" style={{ direction: "ltr" }}>
                  <span className="text-brand">{img.repo}</span>
                  <span className="text-text-muted">:</span>
                  <span className="font-semibold text-text-main">{img.tag}</span>
                </td>
                <td className="py-11 font-mono text-[10px] text-text-muted ltr-text" style={{ direction: "ltr" }}>{img.digest.slice(0, 18)}…</td>
                <td className="py-11 ltr-text text-text-muted">{img.size}</td>
                <td className="py-11 font-mono text-[10px] text-text-muted ltr-text">{img.platform}</td>
                <td className="py-11">
                  {img.vulns === 0
                    ? <span className="px-7 py-2 rounded-5 bg-green-100 text-green-700 text-[10px]">بدون آسیب</span>
                    : <span className="px-7 py-2 rounded-5 bg-red-100 text-red-700 text-[10px]">{img.vulns} آسیب</span>
                  }
                </td>
                <td className="py-11 text-text-muted">{img.pushed}</td>
                <td className="py-11 pe-12">
                  <button className="px-8 py-4 rounded-6 border border-border text-red-500 text-[10px] hover:bg-red-50">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
