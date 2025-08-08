export default function Notes() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h2>Deployment Notes</h2>
      <ul>
        <li>Set environment variables in your Vercel project: MONGODB_URI, JWT_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CRON_SECRET.</li>
        <li>Optionally wire a daily Vercel Cron to POST /api/cron/daily with header x-cron-key: CRON_SECRET to perform scheduled transitions and reminders.</li>
        <li>To add a collapsible sidebar across dashboards, use shadcn’s SidebarProvider and Sidebar components as documented, wrapping your layout and trigger accordingly. This pattern provides a responsive off-canvas sidebar and icon-collapsible variant. [^1]</li>
      </ul>
    </div>
  )
}
