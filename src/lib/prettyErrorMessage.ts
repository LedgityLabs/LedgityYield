export const displayedErrors: { [key: string]: string } = {
  // From Ownable.sol
  "Ownable: caller is not the owner": "Only contract owner can call this",
};

export const prettyErrorMessage = (error: Error) => {
  let prettyError = "An unknown error occurred";
  //@ts-ignore
  let details = error.details;
  if (details) {
    // If ethjs-query error
    if (details.startsWith("[ethjs-query]")) {
      details = details.replace("[ethjs-query] while formatting outputs from RPC '", "");
      details = details.slice(0, -1);
      console.log(details);
      const errObj = JSON.parse(details);
      prettyError = errObj.value.data.message;
    } else prettyError = details.split("'")[1];
  } else if (error.message) prettyError = error.message;

  // If the error has a displayed override, use it instead
  const displayOverride = displayedErrors[prettyError];
  if (displayOverride) prettyError = displayOverride;
  return prettyError;
};
