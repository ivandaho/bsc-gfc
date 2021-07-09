# bsc-gfc

### Requirements:
create local `.env` file with `API_KEY` set to your bscscan API key and `BSC_ADDR` to your wallet address

Example `.env` file:

```
API_KEY=my_api_key
BSC_ADDR=0x...1e
```

### Usage:


```
npx ts-node index.ts {lastNTransactions} {bnbPrice}
```
User prompt include start and end date time, wallet address, BNB price, last trx count
```
npx ts-node calculate.ts
```
Fast calculation. Require BSC_ADDR to be setup. Default BNB price at $300 and 100 last transactions from the start of the date till current time.
```
./calculate.sh
```

TODO: dynamic bnb price at time of transaction
