import Link from "next/link";
import { ArrowRight, LayoutDashboard, Sparkles, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-black font-sans p-6">
      <main className="w-full max-w-4xl space-y-12 text-center">
        
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-300">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Link AI Operating System</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
            Welcome to <span className="text-indigo-600 dark:text-indigo-400">Link AI</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl text-gray-500 dark:text-gray-400">
            Select a tool to get started.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          
          {/* Email Sorter (The New Tool) */}
          <Link
            href="/playground/email-sorter"
            className="group flex flex-col items-center p-8 rounded-3xl border-2 border-indigo-100 bg-white hover:border-indigo-600 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Sorter</h3>
            <p className="text-gray-500 text-sm">Clean your inbox with AI.</p>
          </Link>

          {/* Admin Dashboard */}
          <Link
            href="/admin"
            className="group flex flex-col items-center p-8 rounded-3xl border-2 border-gray-100 bg-white hover:border-gray-400 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h3>
            <p className="text-gray-500 text-sm">Manage users and settings.</p>
          </Link>

        </div>

      </main>
    </div>
  );
}
