/**
 * This function splits an array into chunks of the given size. E.g., [1,2,3,4,5,6] with chunk size 2
 * will result in [[1,2],[3,4],[5,6]]
 *
 * @param array The array to split
 * @param chunkSize The size of each chunk
 * @returns The array split into chunks
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, i) =>
    array.slice(i * chunkSize, i * chunkSize + chunkSize)
  );
}
