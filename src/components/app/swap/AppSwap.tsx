import '@swing.xyz/ui/theme.css';
import "./AppSwap.css";
import { Swap } from '@swing.xyz/ui';

export function AppSwap() {
  return (
    <div className="app-swap-container">
      <Swap projectId="swing-bridge" environment='production' />
    </div>
  );
}
