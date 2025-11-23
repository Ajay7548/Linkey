"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Link as LinkIcon,
  Search,
  Copy,
  Trash2,
  Plus,
  MousePointerClick,
  Trophy,
  Check,
} from "lucide-react";
import { Link } from "@/lib/types";
import { toast } from "sonner";

interface LinksTableProps {
  links: Link[];
  onDelete: () => void;
  onAddClick: () => void;
}

type SortOption = "code" | "url";

export default function LinksTable({
  links,
  onDelete,
  onAddClick,
}: LinksTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("code");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const totalLinks = links.length;
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    const mostPopular =
      links.length > 0
        ? links.reduce((prev, current) =>
            prev.clicks > current.clicks ? prev : current
          )
        : null;

    return { totalLinks, totalClicks, mostPopular };
  }, [links]);

  // Filter and sort links
  const processedLinks = useMemo(() => {
    let filtered = links.filter(
      (link) =>
        link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.target_url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "code") {
        return a.code.localeCompare(b.code);
      } else {
        return a.target_url.localeCompare(b.target_url);
      }
    });

    return filtered;
  }, [links, searchTerm, sortBy]);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}/${code}`);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async (code: string) => {
    setDeletingCode(code);

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Link deleted successfully");
        onDelete();
      } else {
        const errorData = await response.json();
        console.error("Error data:", errorData);
        alert("Failed to delete link");
      }
    } catch (err) {
      console.error("Network error during delete:", err);
      alert("Network error");
    } finally {
      setDeletingCode(null);
    }
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  return (
    <div className="w-full space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-enter">
        {/* Total Links */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <p className="text-slate-500 text-sm font-medium mb-1">
              Total Links
            </p>
            <h3 className="text-3xl font-bold text-slate-800">
              {stats.totalLinks}
            </h3>
          </div>
          <div className="absolute right-4 top-4 text-indigo-200 group-hover:text-indigo-300 transition-colors">
            <LinkIcon className="w-8 h-8" />
          </div>
        </div>

        {/* Total Clicks */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <p className="text-slate-500 text-sm font-medium mb-1">
              Total Clicks
            </p>
            <h3 className="text-3xl font-bold text-slate-800">
              {stats.totalClicks}
            </h3>
          </div>
          <div className="absolute right-4 top-4 text-purple-200 group-hover:text-purple-300 transition-colors">
            <MousePointerClick className="w-8 h-8" />
          </div>
        </div>

        {/* Most Popular */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-pink-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <p className="text-slate-500 text-sm font-medium mb-1">
              Top Performer
            </p>
            {stats.mostPopular ? (
              <div>
                <h3 className="text-xl font-bold text-slate-800 truncate">
                  {stats.mostPopular.code}
                </h3>
                <p className="text-sm text-pink-500 font-medium">
                  {stats.mostPopular.clicks} clicks
                </p>
              </div>
            ) : (
              <h3 className="text-xl font-bold text-slate-400">No data</h3>
            )}
          </div>
          <div className="absolute right-4 top-4 text-pink-200 group-hover:text-pink-300 transition-colors">
            <Trophy className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-slate-700 placeholder:text-slate-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2.5 bg-slate-50 border-none rounded-xl text-slate-600 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="code">Sort by Code</option>
            <option value="url">Sort by URL</option>
          </select>

          <button
            onClick={onAddClick}
            className="btn-primary whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Link</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {processedLinks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400">
            <LinkIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            No links found
          </h3>
          <p className="text-slate-500">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first short link to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedLinks.map((link) => (
            <div
              key={link.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group p-6"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/code/${link.code}`}
                      className="text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      {link.code}
                    </a>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                      {link.clicks}
                    </span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyToClipboard(link.code)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Copy"
                    >
                      {copiedCode === link.code ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(link.code);
                      }}
                      disabled={deletingCode === link.code}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <a
                    href={link.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-indigo-600 truncate block transition-colors"
                  >
                    {truncateUrl(link.target_url, 30)}
                  </a>
                  <p className="text-xs text-slate-400 mt-1">
                    {link.last_clicked
                      ? `Last clicked ${new Date(
                          link.last_clicked
                        ).toLocaleDateString()}`
                      : "No clicks yet"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
