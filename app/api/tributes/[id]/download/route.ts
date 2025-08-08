import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import Tribute from "@/models/tribute"
import JSZip from "jszip"

export async function GET(_: Request, { params }: { params: { id: string }}) {
  await getDb()
  const tribute = await Tribute.findById(params.id).lean()
  if (!tribute) return NextResponse.json({ error: "Not found" }, { status: 404 })
  // Enable after 11 months since publish or memorialized
  const baseDate = tribute.memorializedAt || tribute.publishedAt || tribute.createdAt
  const canDownload = baseDate && (Date.now() - new Date(baseDate).getTime()) >= 1000*60*60*24*30*11
  if (!canDownload) return NextResponse.json({ error: "Available after 11 months" }, { status: 403 })
  const zip = new JSZip()
  zip.file("metadata.json", JSON.stringify(tribute, null, 2))
  const gallery = tribute.images || []
  // fetch each image as blob
  for (let i=0;i<gallery.length;i++) {
    const img = gallery[i]
    const res = await fetch(img.url)
    const buf = await res.arrayBuffer()
    zip.file(`images/${i+1}.jpg`, buf)
  }
  const content = await zip.generateAsync({ type: "nodebuffer" })
  return new NextResponse(content, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="tribute-${params.id}.zip"`,
    }
  })
}
