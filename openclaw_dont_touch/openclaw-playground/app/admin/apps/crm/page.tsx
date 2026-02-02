import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Need to check if table exists or use divs
import { Users, DollarSign, Clock } from 'lucide-react';

export default function CrmPage() {
  // Mock Data for MVP
  const leads = [
    { id: 1, name: 'Acme Corp', contact: 'alice@acme.com', status: 'Onboarded', value: '$5,000', date: '2h ago' },
    { id: 2, name: 'Stark Industries', contact: 'tony@stark.com', status: 'Pending', value: '$12,000', date: '5h ago' },
    { id: 3, name: 'Wayne Enterprises', contact: 'bruce@wayne.com', status: 'In Wizard', value: '-', date: '1d ago' },
    { id: 4, name: 'Cyberdyne', contact: 'sales@cyberdyne.com', status: 'Churned', value: '$0', date: '2d ago' },
  ];

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white border border-gray-200 rounded-xl text-blue-600 shadow-sm">
           <Users className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Leads CRM</h1>
          <p className="text-gray-500">Manage incoming clients from the Wizard funnel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm text-left">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Company</th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Contact</th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Value</th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Time</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b transition-colors hover:bg-gray-50">
                      <td className="p-4 font-medium">{lead.name}</td>
                      <td className="p-4">{lead.contact}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={`
                          ${lead.status === 'Onboarded' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${lead.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                          ${lead.status === 'Churned' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        `}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="p-4">{lead.value}</td>
                      <td className="p-4 text-gray-500">{lead.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
