import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-900",
    approved: "bg-emerald-100 text-emerald-900",
    published: "bg-emerald-100 text-emerald-900",
    memorialized: "bg-purple-100 text-purple-900",
    archived: "bg-muted text-foreground",
  }
  return <Badge className={map[status] || "bg-muted"}>{status}</Badge>
}
