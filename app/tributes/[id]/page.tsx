import { getDb } from "@/lib/db"
import Tribute from "@/models/tribute"
import Comment from "@/models/comment"
import { notFound } from "next/navigation"

export default async function TributePublicPage({ params }: { params: { id: string }}) {
  await getDb()
  const tribute = await Tribute.findById(params.id).lean()
  if (!tribute) return notFound()
  const comments = await Comment.find({ tributeId: tribute._id }).sort({ createdAt: 1 }).lean()

  const isMemorial = tribute.status === "memorialized"
  const portrait = tribute.images?.find((i:any)=>i.type==="portrait")?.url

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={portrait || "/placeholder.svg?height=280&width=280&query=memorial+portrait"} alt="portrait" className="w-48 h-64 object-cover rounded-md" />
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">{tribute.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{tribute.dob} — {tribute.dod}</p>
          {tribute.epitaph && <p className="mt-2 italic">{'"'}{tribute.epitaph}{'"'}</p>}
          <article className="prose prose-sm dark:prose-invert mt-4 whitespace-pre-wrap">
            {tribute.eulogy}
          </article>
        </div>
      </div>

      {!isMemorial && tribute.funeralInfo?.venue && (
        <section className="mt-8 rounded-md border p-4">
          <h2 className="font-medium">Funeral Information</h2>
          <div className="text-sm mt-2">
            <div>Venue: {tribute.funeralInfo.venue}</div>
            <div>Date & Time: {tribute.funeralInfo.time}</div>
            {tribute.funeralInfo.streamingLink && <div>Stream: <a className="underline" href={tribute.funeralInfo.streamingLink}>{tribute.funeralInfo.streamingLink}</a></div>}
          </div>
        </section>
      )}

      {isMemorial && tribute.appreciationMessage && (
        <section className="mt-8 rounded-md border p-4 bg-muted/50">
          <h2 className="font-medium">In Appreciation</h2>
          <p className="text-sm mt-2 whitespace-pre-wrap">{tribute.appreciationMessage}</p>
        </section>
      )}

      {tribute.allowPublicTributes && !isMemorial && (
        <section className="mt-8">
          <h2 className="font-medium mb-2">Tributes</h2>
          <div className="space-y-3">
            {comments.map((c:any)=>(
              <div key={c._id} className="rounded-md border p-3">
                <div className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</div>
                <div className="mt-1 whitespace-pre-wrap">{c.message}</div>
              </div>
            ))}
          </div>
          <CommentForm tributeId={String(tribute._id)} />
        </section>
      )}
    </main>
  )
}

function CommentForm({ tributeId }: { tributeId: string }) {
  return (
    <form className="mt-4" action={`/api/comments`} method="POST">
      <input type="hidden" name="tributeId" value={tributeId} />
      <textarea name="message" required rows={3} className="w-full rounded-md border p-2 text-sm" placeholder="Write a condolence message..." />
      <div className="mt-2">
        <button className="px-3 py-1.5 rounded-md border">Post Comment</button>
      </div>
    </form>
  )
}
