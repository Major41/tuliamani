import { getDb } from "@/lib/db";
import Tribute from "@/models/tribute";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function MemorialsPage() {
  await getDb();
  const memorials = await Tribute.find({ status: "memorialized" })
    .sort({ memorializedAt: -1 })
    .limit(50)
    .lean();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Memorials</h1>
        <p className="text-sm text-muted-foreground">
          A curated archive of cherished memories.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {memorials.map((m: any) => (
            <Link
              key={m._id}
              href={`/obituaries/${m._id}`}
              className="rounded-lg border p-3 hover:shadow-sm transition"
            >
              <img
                src={
                  m.images?.find((i: any) => i.type === "portrait")?.url ||
                  "/placeholder.svg?height=160&width=320&query=portrait+memorial"
                }
                className="w-full h-40 object-cover rounded-md"
                alt="portrait"
              />
              <div className="mt-3">
                <div className="font-semibold">{m.name}</div>
                <div className="text-xs text-muted-foreground">
                  {m.dob} — {m.dod}
                </div>
              </div>
            </Link>
          ))}
          {memorials.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No memorials yet.
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
