"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";

interface RestrictionResponse {
 restricted: boolean;
}

const useRestricted = () => {
 const [isRestricted, setIsRestricted] = useState(false);
 const [isLoading, setIsLoading] = useState(true);
 const account = useAccount();

 const updateRestrictionStatus = useCallback(async () => {
   try {
     setIsLoading(true);
     const addressParam = account.address ? `?address=${account.address}` : "";
     const response = await fetch(`/api/aml/inspectAccount${addressParam}`, {
       cache: "force-cache",
       next: { revalidate: 60 },
     });

     if (!response.ok) {
       throw new Error(`Error fetching AML endpoint: ${response.statusText}`);
     }

     const data: RestrictionResponse = await response.json();
     setIsRestricted(data.restricted);
   } catch (error) {
     console.error("Error checking restriction status:", error);
     setIsRestricted(false);
   } finally {
     setIsLoading(false);
   }
 }, [account.address]);

 useEffect(() => {
   updateRestrictionStatus();
 }, [updateRestrictionStatus]);

 return { isRestricted, isLoading };
};

export default useRestricted;