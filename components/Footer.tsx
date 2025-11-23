import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} TinyLink. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="/health"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              System Health
            </Link>
            <a
              href="https://github.com/Ajay7548/Linkey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
