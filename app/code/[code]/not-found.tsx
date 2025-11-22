export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Link Not Found</h2>
                <p className="text-gray-600 mb-8">The short link you're looking for doesn't exist.</p>
                <a
                    href="/"
                    className="inline-block px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
                >
                    Go to Dashboard
                </a>
            </div>
        </div>
    );
}
