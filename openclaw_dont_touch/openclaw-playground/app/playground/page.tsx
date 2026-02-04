import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function PlaygroundHome() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 font-sans">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Link AI Playground</h1>
          <p className="text-xl text-gray-500">Experimental tools and mini-apps.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Email Sorter Card */}
          <Link 
            href="/playground/email-sorter"
            className="group flex flex-col items-center p-8 rounded-3xl border border-gray-200 bg-gray-50 hover:border-black hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Sorter</h3>
            <p className="text-gray-500 text-sm mb-6">AI-powered inbox zero wizard.</p>
            <div className="flex items-center text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
              Launch <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Placeholder for future tools */}
          <div className="flex flex-col items-center p-8 rounded-3xl border border-dashed border-gray-200 bg-white opacity-50 cursor-not-allowed">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">🚧</span>
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">Coming Soon</h3>
            <p className="text-gray-400 text-sm">More tools in development.</p>
          </div>
        </div>

        <div className="pt-10">
            <Link href="/" className="text-gray-400 hover:text-black text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
