import { notFound } from "next/navigation";
import StatsCard from "@/components/StatsCard";
import { getLinkByCode, initializeDatabase } from "@/lib/db";

interface StatsPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function StatsPage({ params }: StatsPageProps) {
  await initializeDatabase();

  const { code } = await params;
  const link = await getLinkByCode(code);

  if (!link) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 animate-fade-in">
          <a
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold transition-colors group"
          >
            <svg
              className="w-6 h-6 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </a>
        </div>

        <div className="flex justify-center animate-slide-up">
          <StatsCard link={link} />
        </div>
      </div>
    </main>
  );
}
