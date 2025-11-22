"use client";

import { useState, useEffect } from "react";
import LinksTable from "@/components/LinksTable";
import LinkFormModal from "@/components/LinkFormModal";
import { Link } from "@/lib/types";

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/links");
      const data = await response.json();

      if (data.success) {
        setLinks(data.links);
        setError("");
      } else {
        setError("Failed to load links");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleModalSuccess = () => {
    fetchLinks();
  };

  return (
    <main className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto animate-enter">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Shorten Your <span className="text-gradient">Links</span>,
              <br />
              Expand Your <span className="text-gradient">Reach</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              A powerful, modern URL shortener designed for performance and
              simplicity. Track clicks, manage links, and analyze your traffic
              in real-time.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary text-lg px-8 py-4 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Link
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-slate-500 font-medium">
              Loading your dashboard...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8 flex items-center gap-4 animate-enter">
            <div className="p-3 bg-red-100 rounded-xl text-red-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">
                Error Loading Links
              </h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Links Table */}
        {!loading && !error && (
          <LinksTable
            links={links}
            onDelete={fetchLinks}
            onAddClick={() => setIsModalOpen(true)}
          />
        )}

        {/* Modal */}
        <LinkFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      </div>
    </main>
  );
}
