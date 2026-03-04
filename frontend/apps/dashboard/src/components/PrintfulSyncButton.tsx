import { useState } from 'react';
import { drupalClient } from '@rareimagery/api';

interface PrintfulSyncButtonProps {
  storeNodeId: number;
}

export function PrintfulSyncButton({ storeNodeId }: PrintfulSyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setResult(null);

    try {
      const res = await drupalClient.post<{ synced_count: number }>(
        `/api/dashboard/stores/${storeNodeId}/printful-sync`,
        {},
      );
      setResult(`Synced ${res.synced_count} products from Printful.`);
    } catch (err) {
      setResult(
        `Sync failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="dashboard__printful-sync">
      <button
        type="button"
        onClick={handleSync}
        disabled={isSyncing}
        className="dashboard__sync-button"
      >
        {isSyncing ? 'Syncing...' : 'Sync from Printful'}
      </button>
      {result && <p className="dashboard__sync-result">{result}</p>}
    </div>
  );
}
