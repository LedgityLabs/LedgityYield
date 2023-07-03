import { FC, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TokenLogo,
} from "@/components/ui";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { AdminLToken } from "./AdminLToken";
import { LTokenId } from "../../../../../hardhat/deployments";

export const AdminLTokens: FC = () => {
  const lTokens = useAvailableLTokens();
  const [lToken, setLToken] = useState(lTokens.length > 0 ? lTokens[0] : undefined);
  return (
    <section className="flex flex-col gap-6 justify-center items-center">
      <Select onValueChange={(value: LTokenId) => setLToken(value)} value={lToken}>
        <SelectTrigger>
          <SelectValue placeholder="No L-Tokens available" />
        </SelectTrigger>
        <SelectContent>
          {lTokens.map((_lToken) => (
            <SelectItem value={_lToken} key={_lToken}>
              <div className="flex justify-center items-center gap-[0.6rem]">
                <TokenLogo symbol={_lToken} size={28} />
                <p className="font-semibold">{_lToken}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {lToken && <AdminLToken lTokenId={lToken} />}
    </section>
  );
};
