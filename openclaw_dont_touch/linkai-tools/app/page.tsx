import Link from "next/link";
import { Mail, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 font-sans p-6 text-gray-900">
      <main className="w-full max-w-4xl space-y-12 text-center">
        
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-600 shadow-sm">
            <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
            <span>Link AI Tools</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Inbox <span className="text-blue-600">Zero</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl text-gray-500">
            AI-powered email organization. Define your intent, we handle the rest.
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            href="/email-sorter"
            className="group relative flex flex-col items-center p-10 rounded-3xl border-2 border-white bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 w-full max-w-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <Mail className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Sorter</h3>
                <p className="text-gray-500 font-medium">Launch Wizard →</p>
            </div>
          </Link>
        </div>

      </main>
    </div>
  );
}
