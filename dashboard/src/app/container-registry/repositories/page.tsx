"use client";

import { useState } from "react";
import Link from "next/link";

interface Repo {
  name:       string;
  visibility: "public" | "private";
  images:     number;
  pulls:      number;
  size:       string;
  updated:    string;
  tags:       number;
}

const REPOS: Repo[] = [
  { name: "api",            visibility: "private", images: 48, pulls: 12430, size: "1.2 GB", updated: "۲ ساعت پیش", tags: 12  },
  { name: "worker",         visibility: "private", images: 32, pulls: 8750,  size: "890 MB", updated: "۲ ساعت پیش", tags: 8   },
  { name: "nginx-custom",   visibility: "private", images: 15, pulls: 4200,  size: "220 MB", updated: "دیروز",       tags: 5   },
  { name: "ml-trainer",     visibility: "private", images: 20, pulls: 650,   size: "4.5 GB", updated: "۳ روز پیش",  tags: 6   },
  { name: "monitoring-base",visibility: "public",  images: 8,  pulls: 30200, size: "340 MB", updated: "۱ هفته پیش", tags: 4   },
  { name: "db-init",        visibility: "private", images: 5,  pulls: 320,   size: "80 MB",  updated: "۲ هفته پیش", tags: 3   },
  { name: "backup-scripts", visibility: "private", images: 10, pulls: 190,   size: "55 MB",  updated: "۱ ماه پیش",  tags: 4   },
];

export default function RepositoriesPage() {
  const [search, setSearch] = useState("");

  const filtered = REPOS.filter((r) => !search || r.name.includes(search));

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">مخازن Container Registry</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت image‌های Docker</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ مخزن جدید</button>
            <Link href="/container-registry" className="text-[12px] text-text-muted hover:text-brand">← Registry</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "مخزن",     value: REPOS.length,                                             color: "#2554d8" },
            { label: "عمومی",    value: REPOS.filter((r) => r.visibility === "public").length,    color: "#16a34a" },
            { label: "کل image", value: REPOS.reduce((a, r) => a + r.images, 0),                 color: "#7c3aed" },
            { label: "کل pull",  value: REPOS.reduce((a, r) => a + r.pulls, 0).toLocaleString(), color: "#d97706" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-14">
        <input type="text" placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="px-12 py-8 rounded-8 border border-border bg-bg text-[12px] outline-none focus:border-brand w-[200px]" />
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">نام مخزن</th>
              <th className="text-start py-12 font-medium">دسترسی</th>
              <th className="text-start py-12 font-medium">image</th>
              <th className="text-start py-12 font-medium">tag</th>
              <th className="text-start py-12 font-medium">Pull</th>
              <th className="text-start py-12 font-medium">حجم</th>
              <th className="text-start py-12 font-medium">بروز</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.name} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-mono font-semibold text-[11px] text-brand">{r.name}</td>
                <td className="py-11">
                  <span className={`px-7 py-2 rounded-5 text-[10px] font-medium ${r.visibility === "public" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                    {r.visibility === "public" ? "عمومی" : "خصوصی"}
                  </span>
                </td>
                <td className="py-11 font-semibold text-text-main">{r.images}</td>
                <td className="py-11 text-text-muted">{r.tags}</td>
                <td className="py-11 text-text-muted">{r.pulls.toLocaleString()}</td>
                <td className="py-11 ltr-text text-text-muted">{r.size}</td>
                <td className="py-11 text-text-muted">{r.updated}</td>
                <td className="py-11 pe-12">
                  <Link href="/container-registry/images" className="px-8 py-4 rounded-6 border border-border text-text-muted text-[10px] hover:bg-bg">imageها</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
