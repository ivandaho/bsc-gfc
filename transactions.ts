import { calculateGasUsedInTransaction } from "./gas";

export interface ITransaction {
  gasUsed: number;
  gasPrice: number;
  timeStamp: string;
}

/** returns total transaction fees in BNB */
export const calcGasLastNTrans = (
  trans: ITransaction[],
  transCountIndexNonInclusive: number,
  bnbPrice: number
): number => {
  return trans.slice(0, transCountIndexNonInclusive).reduce((acc, curr, i) => {
    const ts = parseInt(curr.timeStamp) * 1000;
    const d = new Date(ts).toString().substring(0, 24);
    const gas = calculateGasUsedInTransaction(curr.gasUsed, curr.gasPrice);
    const numbering = `${(i + 1).toString().padStart(2, "0")} `;
    console.log(`${numbering}  ${d}  $${(gas * bnbPrice).toFixed(2)} `, gas);
    return acc + gas;
  }, 0);
};
