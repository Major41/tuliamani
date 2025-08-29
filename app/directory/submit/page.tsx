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
      window.location.href = "/directory";
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

        {/* Payment Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <h3 className="font-semibold text-blue-800 mb-2">
            Payment Instructions
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            To complete your service listing, please make payment via M-Pesa
            using the following steps:
          </p>
          <ol className="text-sm text-blue-700 list-decimal pl-5 space-y-1">
            <li>Go to M-Pesa on your phone</li>
            <li>
              Select <strong>Lipa Na M-Pesa</strong>
            </li>
            <li>
              Select <strong>Buy Goods and Services</strong>
            </li>
            <li>
              Enter Till Number: <strong>781086</strong>
            </li>
            <li>
              Enter Amount: <strong>3000</strong>
            </li>
            <li>Enter your M-Pesa PIN and confirm</li>
            <li>Wait for the confirmation message</li>
            <li>Enter the transaction code in the field below</li>
          </ol>
          <p className="text-xs text-blue-600 mt-3">
            Your listing will be activated after we verify your payment.
          </p>
        </div>

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

          <div className="bg-gray-50 p-4 rounded-lg border">
            <label className="text-sm font-medium">
              M-Pesa Transaction Code *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Enter the transaction code from your M-Pesa payment confirmation
              message
            </p>
            <Input
              value={mpesaCode}
              onChange={(e) => setMpesaCode(e.target.value)}
              placeholder="e.g., RF48H9J2K0"
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
