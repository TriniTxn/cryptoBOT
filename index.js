const AXIOS = require("axios");
const CRYPTO = require("crypto");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 58200.00;
const SELL_PRICE = 60000.00;
const QUANTITY = "0.00001";
const API_KEY = "SUS";
const API_SECRET = "sus";

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
        isOpened = true;
        newOrder(SYMBOL, QUANTITY, "buy");
    }
    else if(sma13 < sma21 && isOpened === true){
        newOrder(SYMBOL, QUANTITY, "sell")
        isOpened = false;
    }
    else
        console.log("aguardar");
}

async function newOrder(symbol, quantity, side){
    const order = { symbol, quantity, side };
    order.type = "MARKET";
    order.timestamp = Date.now();

    const signature = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(new URLSearchParams(order).toString())
        .digest("hex");

    order.signature = signature;

    try {
        const {data} = await axios.post(
            API_URL + "/v3/order",
            new URLSearchParams(order).toString,
            { headers: { "X-MBX-APIKEY": API_KEY } }
        )

        console.log(data);
    } catch(err) {
        console.error(err.response.data);
    }
}

setInterval(start, 3000);

start();