const express = require('express');
const WebSocket = require('ws');
const Binance = require('binance-api-node').default;
const Decimal = require('decimal.js');

const app = express();
const wss = new WebSocket.Server({ port: 8001 });
const binanceClient = Binance();

// MT4 compatible symbol mapping
const symbolMapping = {
  'BTCUSDT': 'BTCUSD',
  'ETHUSDT': 'ETHUSD',
  'BNBUSDT': 'BNBUSD',
  'XRPUSDT': 'XRPUSD',
  'ADAUSDT': 'ADAUSD',
  'DOGEUSDT': 'DOGEUSD',
  'SOLUSDT': 'SOLUSD',
  // Add more symbols as needed
};

// Store latest prices
const prices = new Map();

// Fetch initial prices and setup websocket connections
async function initializePrices() {
  const tickers = await binanceClient.prices();
  Object.entries(tickers).forEach(([symbol, price]) => {
    if (symbolMapping[symbol]) {
      prices.set(symbolMapping[symbol], new Decimal(price));
    }
  });
}

// Setup Binance websocket streams
function setupBinanceStreams() {
  const symbols = Object.keys(symbolMapping);
  const streams = symbols.map(symbol => `${symbol.toLowerCase()}@ticker`);
  
  binanceClient.ws.trades(symbols, trade => {
    const mtSymbol = symbolMapping[trade.symbol];
    if (mtSymbol) {
      prices.set(mtSymbol, new Decimal(trade.price));
      broadcastPrice(mtSymbol, trade.price);
    }
  });
}

// Broadcast price updates to MT4 clients
function broadcastPrice(symbol, price) {
  const message = JSON.stringify({
    symbol,
    price: price.toString(),
    timestamp: Date.now()
  });
  
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New MT4 client connected');
  
  // Send current prices to new client
  prices.forEach((price, symbol) => {
    ws.send(JSON.stringify({
      symbol,
      price: price.toString(),
      timestamp: Date.now()
    }));
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// HTTP endpoints for MT4
app.get('/symbols', (req, res) => {
  res.json(Object.values(symbolMapping));
});

app.get('/price/:symbol', (req, res) => {
  const price = prices.get(req.params.symbol);
  if (price) {
    res.json({
      symbol: req.params.symbol,
      price: price.toString(),
      timestamp: Date.now()
    });
  } else {
    res.status(404).json({ error: 'Symbol not found' });
  }
});

// Initialize and start server
async function startServer() {
  try {
    await initializePrices();
    setupBinanceStreams();
    
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`MT4 Crypto Server running on port ${PORT}`);
      console.log(`WebSocket server running on port 8001`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
}

startServer();