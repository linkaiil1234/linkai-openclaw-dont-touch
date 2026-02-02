import { getConfig } from '@/app/actions/config';
import SettingsClient from './client-view';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const config = await getConfig();
  return <SettingsClient initialConfig={config} />;
}
