import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MessageCircle, Mic, Search, BarChart3, Check, Terminal, Shield } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const CAPABILITIES = [
  {
    id: 'wizard',
    name: 'Onboarding Protocol',
    description: 'The automated flow I use to onboard new users. (Status: Active)',
    icon: Sparkles,
    status: 'active',
    type: 'Core Workflow',
    href: '/wizard'
  },
  {
    id: 'telegram',
    name: 'Telegram Uplink',
    description: 'My connection to the Telegram Bot API. Handles 500 errors.',
    icon: MessageCircle,
    status: 'active',
    type: 'Integration',
    href: '/admin/tasks'
  },
  {
    id: 'memory',
    name: 'Long-Term Memory',
    description: 'Read/Write access to Upstash Redis (My Brain).',
    icon: Shield,
    status: 'active',
    type: 'Core System',
    href: '/admin/brain'
  },
  {
    id: 'researcher',
    name: 'Deep Researcher',
    description: 'Skill: Brave Search + Scraping + Summarization.',
    icon: Search,
    status: 'standby',
    type: 'Worker Agent'
  },
  {
    id: 'voice',
    name: 'Voice Interface',
    description: 'Skill: LiveKit/Twilio integration for phone calls.',
    icon: Mic,
    status: 'disabled',
    type: 'Worker Agent'
  },
  {
    id: 'analytics',
    name: 'Business Intelligence',
    description: 'Skill: Funnel analysis and conversion tracking module.',
    icon: BarChart3,
    status: 'active',
    type: 'Internal Tool',
    href: '/admin/analytics'
  }
];

export default function CapabilitiesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agent Capabilities</h1>
        <p className="text-gray-500 mt-1">Control my installed skills, integrations, and active protocols.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAPABILITIES.map((cap) => (
          <Card key={cap.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white group">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-gray-50 text-gray-700 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <cap.icon className="h-6 w-6" />
                </div>
                <Badge variant="outline" className={`
                  ${cap.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                  ${cap.status === 'standby' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                  ${cap.status === 'disabled' ? 'bg-gray-50 text-gray-500 border-gray-200' : ''}
                `}>
                  {cap.status}
                </Badge>
              </div>
              <div className="mt-4">
                 <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider text-[10px] mb-1">{cap.type}</h3>
                 <CardTitle className="text-lg text-gray-900">{cap.name}</CardTitle>
              </div>
              <CardDescription className="h-10 text-sm leading-relaxed mt-1">
                {cap.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              {cap.href ? (
                <Button asChild className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm">
                  <Link href={cap.href}>Inspect / Run</Link>
                </Button>
              ) : (
                <Button variant="outline" className="w-full border-dashed text-gray-400" disabled>
                  Coming Soon
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
