import {
  Button,
  Card,
  DialogTrigger,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import {
  AffiliateResponse,
  createAffiliateCode,
  RequestParams,
} from "@/services/api/createAffiliateCode";
import clsx from "clsx";
import { FC, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useCopyToClipboard } from "usehooks-ts";
import { getAddress } from "viem";

export const AppAffiliate: FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedText, copy] = useCopyToClipboard();
  const [affiliateData, setAffiliateData] = useState<AffiliateResponse>();

  const handleCopy = (text: string) => {
    copy(text);
  };

  const sendAffiliateRequest = async () => {
    if (walletAddress?.length) {
      handleCopy("");
      setIsLoading(true);
      const requestParams: RequestParams = {
        walletAddress: walletAddress,
      };
      const data = await createAffiliateCode(requestParams);
      setAffiliateData(data);
      setIsLoading(false);
    }
  };
  return (
    <div className="lg:w-[1080px] flex flex-col items-center justify-center w-full h-full text-slate-700 gap-y-4">
      <span className="text-2xl lg:text-5xl font-extrabold text-nowrap leading-loose">
        Affiliate Program
      </span>
      <div className="lg:w-[600px] text-center w-full">
        Simply invite your friends with your referral link and{" "}
        <p className="text-primary font-bold inline-block">earn up to 50% </p>
        {"Ledgity's commission from the referral. It's as easy as that!"}
      </div>
      <div className="w-full grid grid-cols-12 gap-5 content-center place-content-center">
        <Card
          circleIntensity={0.07}
          defaultGradient={true}
          className="w-full flex flex-col items-center col-span-12 xl:col-span-6 gap-2 p-8"
        >
          <div className="">Paste your wallet to participate in the affiliate program!</div>
          <div className="flex flex-col justify-start w-full gap-2">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Input Wallet Address"
                value={walletAddress}
                onChange={(e) => (setWalletAddress ? setWalletAddress(e.target.value) : null)}
                disableDefaultCss={true}
                className="bg-gray-300 p-2 rounded-lg text-sm w-full"
              />
              <Button
                size="tiny"
                onClick={sendAffiliateRequest}
                disabled={isLoading}
                className="px-4"
              >
                Create
                {isLoading && (
                  <i className="text-xl text-gray-300 font-bold ri-loader-4-fill animate-spin"></i>
                )}
              </Button>
            </div>
            <div className="flex justify-center w-full">
              {affiliateData && affiliateData?.isSuccess && (
                <span className="font-semibold border rounded-lg p-2 bg-green-600 text-white">
                  Affiliate code created successfully!
                </span>
              )}
              {affiliateData && !affiliateData?.isSuccess && (
                <span className="font-semibold border rounded-lg p-2 bg-red-500 text-white">
                  {affiliateData?.message}
                </span>
              )}
            </div>
          </div>
        </Card>
        <Card
          circleIntensity={0.07}
          defaultGradient={true}
          className="w-full flex flex-col items-center col-span-12 xl:col-span-6 gap-2 p-8"
        >
          <div className="text-center">
            {
              "Copy your referral link and share it to earn up to 50% of Ledgity's commission and help your friends get stable yield."
            }
          </div>
          <div className="relative flex bg-gray-300 w-full rounded-lg">
            <i
              className={clsx(
                copiedText ? "ri-checkbox-circle-line" : "ri-link",
                "rounded-full px-1 text-2xl font-bold absolute z-20 h-8 top-1/2 transform -translate-y-1/2 left-1 bg-none hover:cursor-pointer hover:bg-gray-100",
              )}
              onClick={() => handleCopy(affiliateData?.referralUrl || "")}
            />

            <input
              type="text"
              value={affiliateData?.referralUrl}
              readOnly
              className="w-full bg-white text-gray-500 focus:ring relative rounded-lg text-sm border border-1 outline-none focus:outline-none pl-12 pr-3 py-2"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
