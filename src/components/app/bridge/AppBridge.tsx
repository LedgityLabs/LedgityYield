import '@swing.xyz/ui/theme.css';
import { Swap } from '@swing.xyz/ui';

export function AppBridge() {
  return <div className="w-[800px]">
      <Swap projectId="swing-bridge" environment='production' />
    </div>
}
