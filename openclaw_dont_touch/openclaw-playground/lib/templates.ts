export interface WorkerTemplate {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  icon: string;
}

export const TEMPLATES: WorkerTemplate[] = [
  { id: 'tpl-researcher', name: 'Sherlock Clone', role: 'Deep Researcher', capabilities: ['search', 'scrape', 'summarize'], icon: 'Search' },
  { id: 'tpl-coder', name: 'Junior Dev', role: 'Frontend Engineer', capabilities: ['react', 'css', 'fix-bugs'], icon: 'Code' },
  { id: 'tpl-writer', name: 'Copywriter', role: 'Content Strategist', capabilities: ['blog', 'social', 'email'], icon: 'Pen' },
  { id: 'tpl-sales', name: 'Closer', role: 'Sales Rep', capabilities: ['outreach', 'crm', 'negotiate'], icon: 'DollarSign' },
];
