import axios from "axios";
import moment from "moment";
import prompt from "prompt";
import { calcGasLastNTrans } from "./transactions";
import { getBlockNumber } from "./util";
import logger from "./winston";
require("dotenv").config();

const { API_KEY, DATE_FORMAT, TIME_FORMAT, BSC_ADDR } = process.env;
const dtFormat = `${DATE_FORMAT} ${TIME_FORMAT}`;
const [, , fastStart, transCount = "100", bnbPrice = "300"] = process.argv;

prompt.start();
var schema = {
  properties: {
    startDate: {
      description: `Enter start date (${DATE_FORMAT})`,
      type: "string",
      default: moment().format(DATE_FORMAT),
      required: true,
    },
    startTime: {
      description: `Enter start time (${TIME_FORMAT})`,
      type: "string",
      default: "00:00:00",
      required: true,
    },
    endDate: {
      description: `Enter end date (${DATE_FORMAT})`,
      type: "string",
      default: moment().format(DATE_FORMAT),
      required: true,
    },
    endTime: {
      description: `Enter end time (${TIME_FORMAT})`,
      type: "string",
      default: moment().format(TIME_FORMAT),
      required: true,
    },
    bscAddr: {
      description: "Enter BSC Address",
      type: "string",
      message: BSC_ADDR,
      default: BSC_ADDR,
      required: true,
    },
    count: {
      description: `Number of transactions`,
      type: "string",
      default: 100,
      required: true,
    },
    price: {
      description: `BNB Price`,
      type: "string",
      default: 300,
      required: true,
    },
  },
};

async function promptUser() {
  const { startDate, endDate, startTime, endTime, bscAddr, price, count } =
    await prompt.get(schema);

  const unixStart = moment(`${startDate} ${startTime}`, dtFormat).unix();
  const unixEnd = moment(`${endDate} ${endTime}`, dtFormat).unix();

  try {
    if (moment(unixStart).isSameOrBefore(moment(unixEnd))) {
      start(unixStart, unixEnd, bscAddr, price, count);
    } else throw "End date cannot be earlier than start date.";
  } catch (err) {
    logger.error(err);
  }
}

async function retrieveBlockNumber(unixStart, unixEnd) {
  return new Promise((resolve, reject) => {
    Promise.all([getBlockNumber(unixStart), getBlockNumber(unixEnd)])
      .then((res) => {
        logger.info(`Block number from  ${res[0]} - ${res[0]}`);
        resolve(res);
      })
      .catch((err) => {
        logger.error(err);
      });
  });
}

async function getTransactions(startBlock, endBlock, bscAddr) {
  const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${bscAddr}&startblock=${startBlock}&endblock=${endBlock}&sort=desc&apikey=${API_KEY}`;
  let result;

  try {
    const { data } = await axios.get(url);
    if (data.message == "OK") {
      result = data.result;
    } else throw data;
  } catch (err) {
    logger.error(err);
  }

  return result;
}

function calculate(data, price, count) {
  const res = calcGasLastNTrans(
    data as any,
    parseInt(count),
    parseFloat(price)
  );

  console.log("");
  logger.info("total USD spent: $", (res * parseFloat(price)).toFixed(2));
  logger.info("total BNB spent:", res);
}

async function start(
  unixStart = moment(
    `${moment().format(DATE_FORMAT)} 00:00:00`,
    dtFormat
  ).unix(),
  unixEnd = moment().unix(),
  bscAddr = BSC_ADDR,
  price = bnbPrice,
  count = transCount
) {
  try {
    if (BSC_ADDR) {
      logger.info(
        `Searching from ${moment.unix(unixStart).format(dtFormat)} - ${moment
          .unix(unixEnd)
          .format(dtFormat)}`
      );
      const res = await retrieveBlockNumber(unixStart, unixEnd);
      const trx = await getTransactions(res[0], res[1], bscAddr);
      logger.info(
        `BNB Price: ${price}, Trx Count: ${count}`
      );
      calculate(trx, price, count);
    } else {
      logger.error("Please set your binance address in .env file");
    }
  } catch (err) {
    logger.error(err);
  }
}

if (fastStart === "-f") {
  start();
} else {
  promptUser();
}
