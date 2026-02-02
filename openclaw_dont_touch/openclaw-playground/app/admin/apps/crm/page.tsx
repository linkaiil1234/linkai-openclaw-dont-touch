import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, DollarSign, UserCircle } from 'lucide-react';
import { getLeads } from '@/app/actions/crm';

export const dynamic = 'force-dynamic';

export default async function CrmPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white border border-gray-200 rounded-xl text-blue-600 shadow-sm">
           <Users className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Task & Lead CRM</h1>
          <p className="text-gray-500">Real-time tracking of tasks assigned to Ori & AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Active Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm text-left">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Task / Company</th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Contact / Context</th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Assigned To</th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Last Update</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b transition-colors hover:bg-gray-50">
                      <td className="p-4 font-medium">{lead.company}</td>
                      <td className="p-4 text-gray-500">{lead.contact}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <UserCircle className={`h-4 w-4 ${lead.assignedTo === 'AI' ? 'text-purple-500' : 'text-blue-500'}`} />
                          <span className="font-semibold">{lead.assignedTo}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`
                          ${lead.status === 'Won' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${lead.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                          ${lead.status === 'New' ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
                        `}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-xs text-gray-400 font-mono">
                        {lead.notes || lead.lastAction}
                      </td>
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
