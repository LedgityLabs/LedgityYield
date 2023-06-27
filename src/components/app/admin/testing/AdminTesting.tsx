import { Card } from "@/components/ui";
import { useGenericStableTokenName } from "@/generated";
import { useLToken } from "@/hooks/useLToken";
import { FC } from "react";
import { ContractId } from "../../../../../hardhat/deployments";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";

const MintFakeUnderlying: FC<{ symbol: string }> = ({ symbol, ...props }) => {
  const { underlyingAddress } = useLToken(symbol as ContractId);
  const { data } = useGenericStableTokenName({ address: underlyingAddress });
  return (
    <div {...props} className="mt-8">
      <h4 className="text-lg font-semibold">{data}</h4>
      <p>- Address: {underlyingAddress}</p>
    </div>
  );
};
export const AdminTesting: FC = () => {
  const lTokens = useAvailableLTokens();

  return (
    <section className="grid grid-cols-[repeat(3,1fr)] grid-flow-row w-[1200px] h-[900px] gap-10 pb-10">
      <Card circleIntensity={0.07} className="p-8">
        <h3 className="text-center font-bold text-2xl pb-4 font-heading text-fg/90">
          Underlying tokens
        </h3>
        <p>
          When Ledgity DeFi is deployed locally or on a testnet, fake stablecoins contracts are also
          automatically deployed to mimic mainnets&apos; ones.
          <br />
          Here are those for the current test network:
        </p>
        {lTokens.map((lToken) => (
          <MintFakeUnderlying key={lToken} symbol={lToken} />
        ))}
      </Card>
    </section>
  );
};
