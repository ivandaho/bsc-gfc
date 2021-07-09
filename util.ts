import moment from "moment";
import axios from "axios";
import prompt from "prompt";
require("dotenv").config();

const { API_KEY } = process.env;

// Provide unix timestamp to get blocknumber
export function getBlockNumber(unix_s) {
  return new Promise(async (resolve, reject) => {
    const url = `https://api.bscscan.com/api?module=block&action=getblocknobytime&timestamp=${unix_s}&closest=before&apikey=${API_KEY}`;
    try {
      const { data } = await axios.get(url);
      if (data.message == "OK") resolve(data.result);
      else throw data;
    } catch (err) {
      reject(err);
    }
  });
}
