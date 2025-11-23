export const dynamic = "force-dynamic";

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${s}s`);

  return parts.join(" ");
}

export default async function HealthPage() {
  const uptime = process.uptime();

  const projectDetails = {
    name: "TinyLink",
    version: "0.1.0",
    description:
      "Shorten URLs, track clicks, and manage your links with TinyLink",
    status: "Active",
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">System Health</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Uptime Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-500 mb-2">
              System Uptime
            </h2>
            <div className="text-4xl font-bold text-blue-600">
              {formatUptime(uptime)}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Since {new Date(Date.now() - uptime * 1000).toLocaleString()}
            </p>
          </div>

          {/* Project Details Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-500 mb-4">
              TinyLink Project Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500">Project Name</div>
                <div className="font-medium text-lg">{projectDetails.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Version</div>
                <div className="font-medium">{projectDetails.version}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500">Description</div>
                <div className="font-medium">{projectDetails.description}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-medium text-green-600">
                  {projectDetails.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
