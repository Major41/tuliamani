"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const CATEGORIES = [
  "Funeral Homes",
  "Caskets",
  "Flowers",
  "Streaming",
  "Transport",
  "Catering",
];

export default function SubmitServicePage() {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]!);
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [mpesaCode, setMpesaCode] = useState("");
  const [logo, setLogo] = useState<{ url: string; public_id: string } | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  async function uploadLogo(file: File) {
    const sign = await fetch("/api/upload/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        folder: "tuliamani/services",
        resourceType: "image",
      }),
    }).then((r) => r.json());
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sign.apiKey);
    form.append("timestamp", String(sign.timestamp));
    form.append("signature", sign.signature);
    form.append("folder", sign.folder);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
      { method: "POST", body: form }
    );
    const data = await res.json();
    setLogo({ url: data.secure_url, public_id: data.public_id });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          category,
          description,
          contact: { name: contactName, phone, email },
          mpesaCode,
          logo,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      window.location.href = "/services";
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
        <h1 className="text-2xl font-semibold">Submit a Service</h1>
        <p className="text-sm text-muted-foreground">
          KES 3,000/year. Admin will verify the Mpesa code.
        </p>
        <form onSubmit={onSubmit} className="space-y-4 mt-6">
          <div>
            <label className="text-sm">Business Name</label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-md h-10 px-3 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Contact Name</label>
              <Input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm">Mpesa Transaction Code</label>
            <Input
              value={mpesaCode}
              onChange={(e) => setMpesaCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && uploadLogo(e.target.files[0])
              }
            />
            {logo && (
              <img
                src={logo.url || "/placeholder.svg"}
                alt="logo"
                className="h-16 mt-2 object-contain"
              />
            )}
          </div>
          <Button disabled={saving}>
            {saving ? "Submitting..." : "Submit Service"}
          </Button>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}
