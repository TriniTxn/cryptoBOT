const AXIOS = require("axios");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 58200.00;
const SELL_PRICE = 60000.00;

const API_URL = "https://testnet.binance.vision/api";//https://api.binance.com

let isOpened = false;

async function start(){
    const { data } = await AXIOS.get(API_URL + "/v3/klines?limit=21&interval=15m&symbol=" + SYMBOL);
    const candle = data[data.length - 1];
    const price = parseFloat(candle[4]);

    console.clear();
    console.log("Price: " + price);

    if(price <= BUY_PRICE && isOpened === false){
        console.log("comprar");
        isOpened = true;
    }
    else if(price >= SELL_PRICE && isOpened === true){
        console.log("vender");
        isOpened = false;
    }
    else
        console.log("aguardar");
}

setInterval(start, 3000);

start();