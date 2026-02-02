import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MessageCircle, Mic, Search, BarChart3, Check } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const APPS = [
  {
    id: 'wizard',
    name: 'Onboarding Wizard',
    description: 'The core funnel. Auto-onboards new clients in 15 minutes.',
    icon: Sparkles,
    status: 'installed',
    href: '/wizard'
  },
  {
    id: 'telegram',
    name: 'Telegram Sentinel',
    description: 'Monitors uptime and handles 500 errors automatically.',
    icon: MessageCircle,
    status: 'installed',
    href: '/admin/tasks'
  },
  {
    id: 'researcher',
    name: 'Deep Researcher',
    description: 'Autonomous web scraping and competitor analysis agent.',
    icon: Search,
    status: 'available',
    price: 'Free'
  },
  {
    id: 'voice',
    name: 'Voice Agent',
    description: 'Twilio/LiveKit integration for phone support.',
    icon: Mic,
    status: 'available',
    price: '$29/mo'
  },
  {
    id: 'analytics',
    name: 'Business Analytics',
    description: 'Advanced funnel metrics and conversion tracking.',
    icon: BarChart3,
    status: 'available',
    price: 'Pro'
  }
];

export default function AppStore() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">App Store</h1>
        <p className="text-gray-500 mt-1">Manage your installed agents and capabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {APPS.map((app) => (
          <Card key={app.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <app.icon className="h-6 w-6" />
                </div>
                {app.status === 'installed' ? (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex gap-1 items-center">
                    <Check className="h-3 w-3" /> Installed
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    {app.price}
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-4 text-lg">{app.name}</CardTitle>
              <CardDescription className="h-10 text-sm leading-relaxed">
                {app.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              {app.status === 'installed' ? (
                <Button asChild className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm">
                  <Link href={app.href || '#'}>Open App</Link>
                </Button>
              ) : (
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  Install
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
