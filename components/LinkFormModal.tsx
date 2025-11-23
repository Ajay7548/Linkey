"use client";

import { useState } from "react";
import { validateLinkInput } from "@/lib/validators";
import { X, AlertCircle, Check, Loader2 } from "lucide-react";

interface LinkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LinkFormModal({
  isOpen,
  onClose,
  onSuccess,
}: LinkFormModalProps) {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Frontend validation
    const validation = validateLinkInput(url, customCode);
    if (!validation.valid) {
      setError(validation.error || "Invalid input");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, customCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create link");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setUrl("");
      setCustomCode("");

      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setUrl("");
      setCustomCode("");
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-enter">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            Create Short Link
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors p-1 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* URL Input */}
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Target URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/long-url"
                disabled={loading}
                className="input-field"
              />
            </div>

            {/* Custom Code Input */}
            <div>
              <label
                htmlFor="customCode"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Custom Code <span className="text-red-500">*</span>{" "}
                <span className="text-slate-400 font-normal text-xs ml-1">
                  (6-8 characters)
                </span>
              </label>
              <input
                type="text"
                id="customCode"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="my-code"
                maxLength={8}
                disabled={loading}
                className="input-field"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-enter">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-red-100 rounded-full text-red-600">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl animate-enter">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-green-100 rounded-full text-green-600">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-green-600 font-medium">
                    Link created successfully!
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary min-w-[140px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4 text-white" />
                  Creating...
                </span>
              ) : (
                "Create Link"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
