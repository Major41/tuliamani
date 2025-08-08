"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type UploadItem = { url: string; public_id: string; type: "portrait" | "gallery" }

export default function NewTributePage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [dob, setDob] = useState("")
  const [dod, setDod] = useState("")
  const [epitaph, setEpitaph] = useState("")
  const [eulogy, setEulogy] = useState("")
  const [portrait, setPortrait] = useState<UploadItem | null>(null)
  const [gallery, setGallery] = useState<UploadItem[]>([])
  const [venue, setVenue] = useState("")
  const [time, setTime] = useState("")
  const [streamingLink, setStreamingLink] = useState("")
  const [contribName, setContribName] = useState("")
  const [contribPhone, setContribPhone] = useState("")
  const [contribEmail, setContribEmail] = useState("")
  const [mpesaCode, setMpesaCode] = useState("")
  const [allowPublic, setAllowPublic] = useState(true)
  const [saving, setSaving] = useState(false)

  const canNext = useMemo(() => {
    if (step === 1) return !!name && !!dob && !!dod && !!eulogy
    if (step === 2) return !!portrait
    if (step === 3) return !!venue && !!time
    if (step === 4) return !!contribName && !!contribPhone
    if (step === 5) return !!mpesaCode
    return true
  }, [step, name, dob, dod, eulogy, portrait, venue, time, contribName, contribPhone, mpesaCode])

  async function handleUpload(file: File, type: "portrait" | "gallery") {
    const signRes = await fetch("/api/upload/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder: "tuliamani/tributes", resourceType: "image" }),
    })
    const signData = await signRes.json()
    const form = new FormData()
    form.append("file", file)
    form.append("api_key", signData.apiKey)
    form.append("timestamp", String(signData.timestamp))
    form.append("signature", signData.signature)
    form.append("folder", signData.folder)
    const cloudName = signData.cloudName
    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: form,
    })
    const data = await uploadRes.json()
    const item: UploadItem = { url: data.secure_url, public_id: data.public_id, type }
    if (type === "portrait") setPortrait(item)
    else setGallery(prev => prev.length < 4 ? [...prev, item] : prev)
  }

  async function onSubmit() {
    setSaving(true)
    try {
      const res = await fetch("/api/tributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, dob, dod, epitaph, eulogy,
          images: [
            ...(portrait ? [portrait] : []),
            ...gallery,
          ],
          funeralInfo: { venue, time, streamingLink },
          contributor: { name: contribName, phone: contribPhone, email: contribEmail },
          mpesaCode,
          allowPublicTributes: allowPublic,
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(()=> ({}))
        throw new Error(d?.error || "Failed to submit tribute")
      }
      window.location.href = "/dashboard"
    } catch (e:any) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Create Tribute</h1>
      <div className="mt-6 space-y-6">
        <Progress step={step} />
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm">Full name of deceased</label>
              <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g., Jane N. Doe" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Date of Birth</label>
                <Input type="date" value={dob} onChange={(e)=>setDob(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Date of Death</label>
                <Input type="date" value={dod} onChange={(e)=>setDod(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm">Epitaph (optional)</label>
              <Input value={epitaph} onChange={(e)=>setEpitaph(e.target.value)} placeholder="Short epitaph" />
            </div>
            <div>
              <label className="text-sm">Eulogy</label>
              <Textarea value={eulogy} onChange={(e)=>setEulogy(e.target.value)} rows={6} />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm">Portrait (required)</label>
              <input type="file" accept="image/*" onChange={(e)=> e.target.files?.[0] && handleUpload(e.target.files[0], "portrait")} />
              {portrait && <img src={portrait.url || "/placeholder.svg"} alt="portrait" className="h-40 rounded-md mt-2 object-cover" />}
            </div>
            <div>
              <label className="text-sm">Gallery (up to 4)</label>
              <input type="file" accept="image/*" onChange={(e)=> e.target.files?.[0] && handleUpload(e.target.files[0], "gallery")} />
              <div className="grid grid-cols-4 gap-2 mt-2">
                {gallery.map((g)=>(
                  <img key={g.public_id} src={g.url || "/placeholder.svg"} className="h-20 w-full object-cover rounded" alt="gallery" />
                ))}
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm">Funeral Venue</label>
              <Input value={venue} onChange={(e)=>setVenue(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Date & Time</label>
              <Input type="datetime-local" value={time} onChange={(e)=>setTime(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Streaming Link (optional)</label>
              <Input value={streamingLink} onChange={(e)=>setStreamingLink(e.target.value)} placeholder="https://..." />
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm">Contributor Name</label>
              <Input value={contribName} onChange={(e)=>setContribName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Contributor Phone</label>
              <Input value={contribPhone} onChange={(e)=>setContribPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-sm">Contributor Email</label>
              <Input type="email" value={contribEmail} onChange={(e)=>setContribEmail(e.target.value)} />
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm">Mpesa Confirmation Code</label>
              <Input value={mpesaCode} onChange={(e)=>setMpesaCode(e.target.value)} placeholder="e.g., QWE12ABC34" />
            </div>
            <div>
              <label className="text-sm">Allow public tributes?</label>
              <Select value={allowPublic ? "yes" : "no"} onValueChange={(v)=>setAllowPublic(v==="yes")}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <Button variant="outline" disabled={step===1} onClick={()=>setStep(s=>s-1)}>Back</Button>
          {step < 5 ? (
            <Button onClick={()=> canNext && setStep(s=>s+1)} disabled={!canNext}>Next</Button>
          ) : (
            <Button onClick={onSubmit} disabled={!canNext || saving}>{saving ? "Submitting..." : "Submit"}</Button>
          )}
        </div>
      </div>
    </main>
  )
}

function Progress({ step }: { step: number }) {
  const total = 5
  return (
    <div className="flex items-center gap-2">
      {Array.from({length: total}).map((_, i)=>(
        <div key={i} className={cn("h-2 flex-1 rounded-full", i < step ? "bg-foreground" : "bg-muted")} />
      ))}
    </div>
  )
}
