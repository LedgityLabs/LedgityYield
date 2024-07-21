import {
  Button,
  Card,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { FC, useState } from "react";

export const AdminDashboard: FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [affiliateCode, setAffiliateCode] = useState<string>("");
  const [searchYear, setSearchYear] = useState<number>(new Date().getFullYear());
  const [searchQuarter, setSearchQuarter] = useState<number>(new Date().getMonth() / 3 + 1);
  const searchYearList = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const quarterList = Array.from({ length: 4 }, (_, i) => i + 1);

  const handleSearch = () => {};

  return (
    <Card className="lg:w-[1080px] flex flex-col gap-5 w-full h-full p-10">
      <h3 className="justify-center text-center font-bold text-2xl font-heading text-fg/90">
        Affiliate Dashboard
      </h3>
      <Card className="grid grid-cols-12 gap-5 w-full p-6" animated={false}>
        <div className="flex flex-col col-span-12 xl:col-span-4 gap-2">
          <h4 className="text-xl">Affiliate User</h4>
          <Input
            placeholder="Affiliate Wallet Address"
            value={walletAddress}
            onChange={(e) => (setWalletAddress ? setWalletAddress(e.target.value) : null)}
            disableDefaultCss={true}
            className="w-full p-2 py-3 rounded-lg"
          />
          <Input
            placeholder="Affiliate Code"
            value={affiliateCode}
            onChange={(e) => (setAffiliateCode ? setAffiliateCode(e.target.value) : null)}
            disableDefaultCss={true}
            className="w-full p-2 py-3 rounded-lg"
          />
        </div>
        <div className="flex flex-col col-span-12 xl:col-span-4 gap-2">
          <h4 className="text-xl">Search Period</h4>
          <Select
            onValueChange={(value) => setSearchYear(Number(value))}
            value={searchYear.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {searchYearList.map((year) => (
                <SelectItem value={year.toString()} key={year}>
                  <div className="flex w-full justify-center items-center">
                    <p className="font-semibold sm:inline hidden">{year}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => setSearchQuarter(Number(value))}
            value={searchQuarter.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Quarter" />
            </SelectTrigger>
            <SelectContent className="h-10">
              {quarterList.map((quarter) => (
                <SelectItem value={quarter.toString()} key={quarter} className="h-10">
                  <div className="flex w-full justify-center items-center">
                    <p className="font-semibold sm:inline hidden">{quarter}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid col-span-12 xl:col-span-4 gap-2 content-end">
          <Button size="medium" onClick={handleSearch} className="w-full bg-primary text-white">
            Search
          </Button>
        </div>
      </Card>
    </Card>
  );
};
