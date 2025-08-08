"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function TributeForm({ obituaryId }: { obituaryId: string }) {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/tributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          obituaryId,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim() || undefined,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit tribute");
      }

      // Reset form and reload page to show new tribute
      setAuthorName("");
      setAuthorEmail("");
      setMessage("");
      window.location.reload();
    } catch (error) {
      alert("Failed to submit tribute. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Your Name</label>
          <Input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email (optional)</label>
          <Input
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            type="email"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Your Tribute</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder="Share a memory, condolence, or tribute..."
        />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Posting..." : "Post Tribute"}
      </Button>
    </form>
  );
}
