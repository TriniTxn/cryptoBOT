const AXIOS = require("axios");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 58200.00;
const SELL_PRICE = 60000.00;

const API_URL = "https://testnet.binance.vision/api";//https://api.binance.com

let isOpened = false;

function calcSMA(data){
    const closes = data.map(candle => parseFloat(candle[4]));
    const sum = closes.reduce((a,b) => a + b);
    return sum / data.length;
}

async function start(){
    const { data } = await AXIOS.get(API_URL + "/v3/klines?limit=21&interval=15m&symbol=" + SYMBOL);
    const candle = data[data.length - 1];
    const price = parseFloat(candle[4]);

    console.clear();
    console.log("Price: " + price);

    const sma21 = calcSMA(data);
    const sma13 = calcSMA(data.slice(8));
    console.log("SMA (21): " + sma21);
    console.log("SMA (13): " + sma13);
    console.log("Is opened? " + isOpened)

    if(sma13 > sma21 && isOpened === false){
        console.log("comprar");
        isOpened = true;
    }
    else if(sma13 < sma21 && isOpened === true){
        console.log("vender");
        isOpened = false;
    }
    else
        console.log("aguardar");
}

setInterval(start, 3000);

start();