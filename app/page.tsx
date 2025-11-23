"use client";

import { useState, useEffect } from "react";
import LinksTable from "@/components/LinksTable";
import LinkFormModal from "@/components/LinkFormModal";
import { Link } from "@/lib/types";
import { Plus, AlertCircle } from "lucide-react";

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
              <AlertCircle className="w-6 h-6" />
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
