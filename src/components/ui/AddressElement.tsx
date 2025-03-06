"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { useTokenInfos } from "@/hooks/contracts";
import { FC } from "react";

const AddToWallet = ({ address }: { address: `0x${string}` }) => {
  const tokenData = useTokenInfos([{ address }]);

  return (
    <button
      className="hover:opacity-70 transition-opacity"
      onClick={() => {
        if (window.ethereum) {
          window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20", // Initially only supports ERC20, but eventually more!
              options: tokenData,
            },
          });
        }
      }}
    >
      <i className="ri-add-circle-line"></i>
    </button>
  );
};

interface Props {
  address: `0x${string}` | null | undefined;
  copyable?: boolean;
  addToWallet?: boolean;
  tooltip?: boolean;
}

export const AddressElement: FC<Props> = ({
  address,
  copyable = false,
  addToWallet = false,
  tooltip = false,
}) => {
  if (!address) return <span>Unknown</span>;
  const formattedAddress = address.slice(0, 6) + "..." + address.slice(-3);
  return (
    <span className="inline-flex gap-2">
      <span>
        {!tooltip ? (
          formattedAddress
        ) : (
          <Tooltip>
            <TooltipTrigger className="cursor-help">
              {formattedAddress}
            </TooltipTrigger>
            <TooltipContent>{address}</TooltipContent>
          </Tooltip>
        )}
      </span>
      {copyable && (
        <span>
          <Tooltip>
            <TooltipTrigger>
              <button
                className="hover:opacity-70 transition-opacity"
                onClick={() => navigator.clipboard.writeText(address)}
              >
                <i className="ri-file-copy-fill"></i>
              </button>
            </TooltipTrigger>
            <TooltipContent>Copy address</TooltipContent>
          </Tooltip>
        </span>
      )}
      {addToWallet && (
        <span>
          <Tooltip>
            <TooltipTrigger>
              <AddToWallet address={address} />
            </TooltipTrigger>
            <TooltipContent>Add to wallet</TooltipContent>
          </Tooltip>
        </span>
      )}
    </span>
  );
};
