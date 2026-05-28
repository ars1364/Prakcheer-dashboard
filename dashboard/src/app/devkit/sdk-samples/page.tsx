"use client";

import { useState } from "react";

type Lang = "python" | "go" | "typescript" | "curl";

const SAMPLES: Record<string, Record<Lang, string>> = {
  "لیست سرورها": {
    python: `import prakcheer

client = prakcheer.Client(api_key="pk_live_...")

instances = client.compute.list_instances(
    region="tehran-1",
    status="active"
)
for vm in instances:
    print(vm.id, vm.name, vm.status)`,
    go: `package main

import (
    "fmt"
    "github.com/prakcheer/sdk-go"
)

func main() {
    c := prakcheer.NewClient("pk_live_...")
    vms, err := c.Compute.ListInstances(
        prakcheer.Region("tehran-1"),
    )
    if err != nil { panic(err) }
    for _, vm := range vms {
        fmt.Println(vm.ID, vm.Name)
    }
}`,
    typescript: `import { PrakcheerClient } from "@prakcheer/sdk";

const client = new PrakcheerClient({ apiKey: "pk_live_..." });

const instances = await client.compute.listInstances({
  region: "tehran-1",
  status: "active",
});
instances.forEach((vm) => console.log(vm.id, vm.name));`,
    curl: `curl -X GET https://api.prakcheer.ir/v1/instances \\
  -H "Authorization: Bearer pk_live_..." \\
  -H "Content-Type: application/json" \\
  -G --data-urlencode "region=tehran-1" \\
     --data-urlencode "status=active"`,
  },
  "ایجاد سرور": {
    python: `vm = client.compute.create_instance(
    name="my-server",
    flavor="c4.xlarge",
    image="ubuntu-22.04",
    region="tehran-1",
    network_id="net-abc123",
    ssh_key="my-key",
)
print("created:", vm.id)`,
    go: `vm, err := c.Compute.CreateInstance(&prakcheer.CreateInstanceRequest{
    Name:      "my-server",
    Flavor:    "c4.xlarge",
    Image:     "ubuntu-22.04",
    Region:    "tehran-1",
    NetworkID: "net-abc123",
    SSHKey:    "my-key",
})`,
    typescript: `const vm = await client.compute.createInstance({
  name: "my-server",
  flavor: "c4.xlarge",
  image: "ubuntu-22.04",
  region: "tehran-1",
  networkId: "net-abc123",
  sshKey: "my-key",
});
console.log("created:", vm.id);`,
    curl: `curl -X POST https://api.prakcheer.ir/v1/instances \\
  -H "Authorization: Bearer pk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "my-server",
    "flavor": "c4.xlarge",
    "image": "ubuntu-22.04",
    "region": "tehran-1",
    "network_id": "net-abc123"
  }'`,
  },
  "مصرف منابع": {
    python: `usage = client.billing.get_usage(
    start="2025-04-01",
    end="2025-04-30",
    group_by="resource_type",
)
for item in usage.breakdown:
    print(item.type, item.cost_irr)`,
    go: `usage, err := c.Billing.GetUsage(&prakcheer.UsageRequest{
    Start:   "2025-04-01",
    End:     "2025-04-30",
    GroupBy: "resource_type",
})`,
    typescript: `const usage = await client.billing.getUsage({
  start: "2025-04-01",
  end:   "2025-04-30",
  groupBy: "resource_type",
});
usage.breakdown.forEach((item) => {
  console.log(item.type, item.costIrr);
});`,
    curl: `curl "https://api.prakcheer.ir/v1/usage?start=2025-04-01&end=2025-04-30&group_by=resource_type" \\
  -H "Authorization: Bearer pk_live_..."`,
  },
};

const LANG_LABELS: Record<Lang, string> = {
  python: "Python", go: "Go", typescript: "TypeScript", curl: "cURL",
};

export default function SdkSamplesPage() {
  const [sample, setSample] = useState(Object.keys(SAMPLES)[0]);
  const [lang, setLang]     = useState<Lang>("python");
  const [copied, setCopied]  = useState(false);

  const code = SAMPLES[sample]?.[lang] ?? "";

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[18px] font-bold text-text-main">نمونه‌های SDK</h1>
        </div>
        <p className="text-[12px] text-text-muted">کدهای آماده برای Python · Go · TypeScript · cURL</p>
        <div className="flex gap-10 mt-12 flex-wrap">
          {(["python", "go", "typescript"] as const).map((l) => (
            <div key={l} className="glass rounded-8 px-12 py-6 text-[11px] text-text-muted">
              <code className="font-mono">pip install prakcheer</code>
              {l === "go" && <code className="font-mono"> / go get github.com/prakcheer/sdk-go</code>}
              {l === "typescript" && <code className="font-mono"> / npm install @prakcheer/sdk</code>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        <div className="glass rounded-16 p-14 flex flex-col gap-4">
          <p className="text-[11px] text-text-muted mb-6">انتخاب نمونه</p>
          {Object.keys(SAMPLES).map((s) => (
            <button key={s} onClick={() => setSample(s)}
              className={`w-full text-start px-12 py-8 rounded-8 text-[13px] transition-all ${sample === s ? "bg-brand text-white" : "hover:bg-bg text-text-muted"}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 glass rounded-16 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-16 py-10 border-b border-border bg-bg/50">
            <div className="flex gap-6">
              {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-12 py-5 rounded-6 text-[12px] font-medium transition-all ${lang === l ? "bg-brand text-white" : "text-text-muted hover:text-text-main"}`}>
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>
            <button onClick={copy} className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg transition-colors">
              {copied ? "کپی شد ✓" : "کپی"}
            </button>
          </div>
          <div className="p-16 overflow-x-auto flex-1">
            <pre className="text-[12px] font-mono text-text-main ltr-text leading-relaxed" style={{ direction: "ltr" }}>{code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
