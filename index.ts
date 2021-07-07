import { calcGasLastNTrans } from "./transactions";
import https from "https";
require("dotenv").config();

const { API_KEY, BSC_ADDR } = process.env;

const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${BSC_ADDR}&startblock=1&endblock=99999999&sort=desc&apikey=${API_KEY}`;

let data = [];

const [, , transCount = "2", bnbPrice = "366"] = process.argv;
console.log(
  `calculating gas for last ${transCount} transactions for wallet ${BSC_ADDR} at $${bnbPrice} per BNB\n`
);
https
  .get(url, (res) => {
    res.on("data", (chunk) => {
      data.push(chunk);
    });

    res.on("end", () => {
      const d = JSON.parse(Buffer.concat(data).toString());

      const res = calcGasLastNTrans(
        d.result as any,
        parseFloat(transCount),
        parseFloat(bnbPrice)
      );

      console.log("");
      console.log(
        "total USD spent: $",
        (res * parseFloat(bnbPrice)).toFixed(2)
      );
      console.log("total BNB spent:", res);
    });
  })
  .on("error", (err) => {
    console.log("Error: ", err.message);
  });
