"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function LegacyBookPage() {
  const [pkg, setPkg] = useState<"design" | "full">("design");
  const [deceasedName, setDeceasedName] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [mpesaCode, setMpesaCode] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/legacy-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageType: pkg,
          deceasedName,
          requesterName,
          contact,
          description,
          deadline,
          mpesaCode,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      window.location.href = "/dashboard";
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Order a Legacy Book</h1>
        <p className="text-sm text-muted-foreground">
          Choose a package and tell us your needs.
        </p>
        <form onSubmit={onSubmit} className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPkg("design")}
              className={`rounded-md border p-4 text-left ${
                pkg === "design" ? "bg-muted" : ""
              }`}
            >
              <div className="font-medium">KES 50,000</div>
              <div className="text-sm text-muted-foreground">Design Only</div>
            </button>
            <button
              type="button"
              onClick={() => setPkg("full")}
              className={`rounded-md border p-4 text-left ${
                pkg === "full" ? "bg-muted" : ""
              }`}
            >
              <div className="font-medium">KES 100,000</div>
              <div className="text-sm text-muted-foreground">Full Curation</div>
            </button>
          </div>
          <div>
            <label className="text-sm">Name of Deceased</label>
            <Input
              value={deceasedName}
              onChange={(e) => setDeceasedName(e.target.value)}
              required
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Requester Name</label>
              <Input
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm">Contact (phone/email)</label>
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <label className="text-sm">Deadline</label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm">Mpesa Code</label>
            <Input
              value={mpesaCode}
              onChange={(e) => setMpesaCode(e.target.value)}
              required
            />
          </div>
          <Button disabled={saving}>
            {saving ? "Placing..." : "Place Order"}
          </Button>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}
