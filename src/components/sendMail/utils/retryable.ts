export const retryable = async <T>(
  executor: () => Promise<T>,
  {
    maxTries = 10,
    initialWaitTime = 5000,
  }: {
    maxTries?: number;
    initialWaitTime?: number;
  } = {}
): Promise<T> => {
  let retryCount = 0;
  let result: T;
  while (true) {
    try {
      result = await executor();
      break;
    } catch (e) {
      console.log('Error: ', e);
      let backoffTime = Math.pow(2, retryCount) * initialWaitTime;
      retryCount++;
      if (retryCount >= maxTries) {
        console.log(`Max retry reached: ${e}`);
        throw e;
      }
      console.log(`Retrying... Waiting for ${backoffTime / 1000} seconds.`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
  return result;
};