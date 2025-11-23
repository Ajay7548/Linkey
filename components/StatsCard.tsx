"use client";

import { Link } from "@/lib/types";
import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";

interface StatsCardProps {
  link: Link;
}

export default function StatsCard({ link }: StatsCardProps) {
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const shortUrl = baseUrl ? `${baseUrl}/${link.code}` : `/${link.code}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-8 max-w-2xl w-full animate-enter">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Link Statistics</h2>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-semibold rounded-full text-sm">
          Active
        </span>
      </div>

      <div className="space-y-8">
        {/* Short Code & URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2">
              Short Code
            </label>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <span className="text-2xl font-bold text-indigo-600">
                {link.code}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2">
              Short URL
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 truncate">
                <span className="text-sm text-slate-700 font-medium">
                  {shortUrl}
                </span>
              </div>
              <button
                onClick={copyToClipboard}
                className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Target URL */}
        <div>
          <label className="block text-sm font-semibold text-slate-500 mb-2">
            Target URL
          </label>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 break-all">
            <a
              href={link.target_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              {link.target_url}
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
            <div className="text-sm font-semibold text-indigo-600 mb-1">
              Total Clicks
            </div>
            <div className="text-3xl font-bold text-indigo-900">
              {link.clicks}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
            <div className="text-sm font-semibold text-blue-600 mb-1">
              Last Clicked
            </div>
            <div
              className="text-sm font-bold text-blue-900 mt-1"
              suppressHydrationWarning
            >
              {formatDate(link.last_clicked)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
            <div className="text-sm font-semibold text-emerald-600 mb-1">
              Created
            </div>
            <div
              className="text-sm font-bold text-emerald-900 mt-1"
              suppressHydrationWarning
            >
              {formatDate(link.created_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
