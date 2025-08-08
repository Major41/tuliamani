import { getDb } from "@/lib/db"
import Service from "@/models/service"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const CATEGORIES = ["Funeral Homes", "Caskets", "Flowers", "Streaming", "Transport", "Catering"]

export default async function ServicesPage({ searchParams }: { searchParams: { category?: string }}) {
  await getDb()
  const filter: any = { status: "published" }
  if (searchParams.category) filter.category = searchParams.category
  const services = await Service.find(filter).sort({ createdAt: -1 }).lean()

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Funeral Service Directory</h1>
            <p className="text-sm text-muted-foreground">Discover trusted providers.</p>
          </div>
          <Link href="/services/submit" className="underline text-sm">Submit your service</Link>
        </div>

        <div className="flex gap-2 flex-wrap mt-4">
          <Link href="/services" className={`text-xs px-2 py-1 rounded border ${!searchParams.category ? "bg-muted" : ""}`}>All</Link>
          {CATEGORIES.map((c)=>(
            <Link key={c} href={`/services?category=${encodeURIComponent(c)}`} className={`text-xs px-2 py-1 rounded border ${searchParams.category===c ? "bg-muted" : ""}`}>{c}</Link>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {services.map((s:any)=>(
            <div key={s._id} className="rounded-lg border p-4">
              <img src={s.logo?.url || "/placeholder.svg?height=80&width=160&query=company+logo"} className="h-16 object-contain" alt="logo" />
              <div className="mt-2 font-semibold">{s.businessName}</div>
              <div className="text-xs text-muted-foreground">{s.category}</div>
              <p className="text-sm mt-2 line-clamp-3">{s.description}</p>
            </div>
          ))}
          {services.length===0 && <div className="text-sm text-muted-foreground">No services yet.</div>}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
