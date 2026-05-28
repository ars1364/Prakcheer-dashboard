"use client";

import { useState } from "react";
import Link from "next/link";

const SCHEDULES = [
  { id: "m1", title: "تعمیرات شبکه مشهد-۱",        region: "مشهد-۱",    start: "۱۴۰۵/۰۳/۱۵ ۰۲:۰۰", end: "۱۴۰۵/۰۳/۱۵ ۰۴:۰۰", impact: "وقفه شبکه کوتاه",  status: "upcoming"  },
  { id: "m2", title: "بروزرسانی Ceph اصفهان",        region: "اصفهان-۱",  start: "۱۴۰۵/۰۳/۱۸ ۰۱:۰۰", end: "۱۴۰۵/۰۳/۱۸ ۰۵:۰۰", impact: "I/O تأخیر بالا",   status: "upcoming"  },
  { id: "m3", title: "بروزرسانی Kernel Compute",     region: "تهران-۱",   start: "۱۴۰۵/۰۳/۲۵ ۰۰:۰۰", end: "۱۴۰۵/۰۳/۲۵ ۰۶:۰۰", impact: "live-migrate VM",   status: "upcoming"  },
  { id: "m4", title: "تعمیرات UPS AZ-B تهران",       region: "تهران-۱",   start: "۱۴۰۵/۰۲/۲۰ ۰۲:۰۰", end: "۱۴۰۵/۰۲/۲۰ ۰۴:۳۰", impact: "کاهش ظرفیت ۲۵%", status: "completed" },
];

const MAINTENANCE_MODE = [
  { node: "compute-04.teh1", reason: "تعویض NIC", since: "۲ روز پیش",  region: "تهران-۱"   },
  { node: "swift-01.msh1",   reason: "بروزرسانی OS", since: "۵ ساعت پیش", region: "مشهد-۱" },
];

export default function MaintenancePage() {
  const [maintenanceNodes, setNodes] = useState(MAINTENANCE_MODE);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">حالت نگهداری</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت تعمیرات برنامه‌ریزی‌شده و حالت maintenance نودها</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          {[
            { label: "نودهای در نگهداری", value: maintenanceNodes.length, color: "#2554d8" },
            { label: "تعمیرات آینده",     value: SCHEDULES.filter((s) => s.status === "upcoming").length, color: "#d97706" },
            { label: "تعمیرات کامل‌شده",  value: SCHEDULES.filter((s) => s.status === "completed").length, color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <h2 className="text-[14px] font-semibold text-text-main">نودهای در حالت نگهداری</h2>
          <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] font-medium hover:bg-brand/90 transition-colors">+ افزودن نود</button>
        </div>
        {maintenanceNodes.length === 0 ? (
          <p className="text-[13px] text-text-muted text-center py-12">هیچ نودی در حالت نگهداری نیست</p>
        ) : (
          <div className="flex flex-col gap-8">
            {maintenanceNodes.map((n) => (
              <div key={n.node} className="flex items-center gap-12 p-14 rounded-10 bg-blue-50 border border-blue-200">
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-text-main font-mono ltr-text" style={{ direction: "ltr" }}>{n.node}</p>
                  <p className="text-[11px] text-text-muted mt-2">{n.reason} · {n.region} · از {n.since}</p>
                </div>
                <button
                  onClick={() => setNodes((ns) => ns.filter((x) => x.node !== n.node))}
                  className="px-12 py-6 rounded-8 bg-green-600 text-white text-[12px] hover:bg-green-700 transition-colors"
                >خروج از نگهداری</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <h2 className="text-[14px] font-semibold text-text-main">تعمیرات برنامه‌ریزی‌شده</h2>
          <button className="px-14 py-7 rounded-8 border border-brand text-brand text-[12px] font-medium hover:bg-brand/5 transition-colors">+ برنامه‌ریزی جدید</button>
        </div>
        <div className="flex flex-col gap-10">
          {SCHEDULES.map((s) => (
            <div key={s.id} className={`rounded-12 border p-16 ${s.status === "completed" ? "opacity-60 border-border bg-bg/30" : "glass border-brand/20"}`}>
              <div className="flex items-start justify-between gap-12">
                <div>
                  <div className="flex items-center gap-8 mb-4">
                    <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${s.status === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {s.status === "completed" ? "کامل" : "آینده"}
                    </span>
                    <p className="text-[13px] font-semibold text-text-main">{s.title}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-12 gap-y-2 text-[11px] text-text-muted">
                    <span>{s.region}</span>
                    <span className="ltr-text" style={{ direction: "ltr" }}>{s.start} → {s.end}</span>
                    <span className="text-amber-700">تأثیر: {s.impact}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
