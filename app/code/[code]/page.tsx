import Link from "next/link";
import { notFound } from "next/navigation";
import StatsCard from "@/components/StatsCard";
import { getLinkByCode, initializeDatabase } from "@/lib/db";
import { ArrowLeft } from "lucide-react";

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
          <Link
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold transition-colors group"
          >
            <ArrowLeft className="w-6 h-6 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex justify-center animate-slide-up">
          <StatsCard link={link} />
        </div>
      </div>
    </main>
  );
}
