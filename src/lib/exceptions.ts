interface PrettyContractsErrors {
  [key: string]: string;
}

export const prettyContractsErrors: PrettyContractsErrors = {
  // From Ownable.sol
  "Ownable: caller is not the owner": "Only contract owner can call this",
};
