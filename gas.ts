/** returns transaction fee in BNB */
export const calculateGasUsedInTransaction = (gasUsed: number, gasPrice: number): number => {
  return (gasUsed * gasPrice) / Math.pow(1000000000, 2);
};
