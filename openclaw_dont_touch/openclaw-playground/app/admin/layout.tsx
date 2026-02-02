import { AdminSidebar } from '@/components/admin/Sidebar';
import { LivePulse } from '@/components/LivePulse';
import { Toaster } from 'sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <LivePulse />
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
