import Link from "next/link";
import { ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-black font-sans p-6">
      <main className="w-full max-w-4xl space-y-12 text-center">
        
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-300">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>New: The 15-Minute Setup</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
            Your Business <span className="text-indigo-600 dark:text-indigo-400">Operating System</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl text-gray-500 dark:text-gray-400">
            Stop hiring service providers. Hire an outcome.
            <br />
            Link AI handles your phones, scheduling, and follow-ups.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/wizard"
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 text-lg font-bold text-white transition-all hover:bg-indigo-700 hover:scale-105 shadow-lg shadow-indigo-200 dark:shadow-none sm:w-auto"
          >
            Start Wizard
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/admin"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-8 text-lg font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900 sm:w-auto"
          >
            <LayoutDashboard className="h-5 w-5" />
            Admin Dashboard
          </Link>
        </div>

        {/* Feature Grid (Decoration) */}
        <div className="grid grid-cols-1 gap-4 pt-10 sm:grid-cols-3 text-left">
          {[
            { title: "Instant Voice", desc: "Hebrew/English native speaking AI." },
            { title: "Auto-Schedule", desc: "Connects to Google Calendar instantly." },
            { title: "WhatsApp 24/7", desc: "Follows up with leads while you sleep." },
          ].map((feature, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
              <h3 className="font-bold text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
