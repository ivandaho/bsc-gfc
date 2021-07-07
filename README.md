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

TODO: dynamic bnb price at time of transaction
