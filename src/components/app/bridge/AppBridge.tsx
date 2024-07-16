import '@swing.xyz/ui/theme.css';
import { Swap } from '@swing.xyz/ui';
import "./AppBridge.css";

export function AppBridge() {
  return <div id="swing">
      <Swap projectId="swing-bridge" environment='production' />
    </div>
}