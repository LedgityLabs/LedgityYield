export const retryable = async <T>(
  executor: () => Promise<T>,
  {
    maxTries = 5,
    initialWaitTime = 1000,
    factor = 2,
  }: {
    maxTries?: number;
    initialWaitTime?: number;
    factor?: number;
  } = {}
): Promise<T> => {
  let retryCount = 0;
  let waitTime = initialWaitTime;

  while (true) {
    try {
      return await executor();
    } catch (e) {
      console.log('Error: ', e);
      retryCount++;
      if (retryCount >= maxTries) {
        console.log(`Max retry reached: ${e}`);
        throw e;
      }
      console.log(`Retrying... Waiting for ${waitTime / 1000} seconds.`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      waitTime *= factor; // Increase wait time for next attempt
    }
  }
};