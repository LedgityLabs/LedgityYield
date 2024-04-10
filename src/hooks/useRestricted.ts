import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

const useRestricted = () => {
  const [isRestricted, setIsRestricted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const account = useAccount();

  const updateRestrictionStatus = async () => {
    setIsLoading(true);
    const addressParam = account.address ? `?address=${account.address}` : "";
    const response = await fetch(`/api/aml/inspectAccount${addressParam}`, {
      cache: "force-cache",
      next: { revalidate: 60 },
    });
    if (!response.ok) console.error(`Error while fetching AML endpoint (${response.statusText})`);
    else {
      const data = await response.json();
      setIsRestricted(data.restricted);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    updateRestrictionStatus();
  }, []);

  return { isRestricted, isLoading };
};

export default useRestricted;
