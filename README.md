# Crypto MT4 Market Data Server

This server provides real-time cryptocurrency market data from Binance for MT4 platforms.

## Features

- Real-time price updates via WebSocket
- Support for major cryptocurrency pairs
- MT4-compatible data format
- REST API endpoints for symbol list and price queries

## Connection Details

- Server Address: YOUR_SERVER_IP
- Port: 8000 (HTTP), 8001 (WebSocket)
- Supported Symbols: BTCUSD, ETHUSD, BNBUSD, XRPUSD, ADAUSD, DOGEUSD, SOLUSD

## MT4 Setup

1. Open MT4 platform
2. Add Custom Server:
   - File > Login to Trade Account
   - Choose "New Server"
   - Enter server address and port
3. Create new demo account
4. Add cryptocurrency symbols to Market Watch

## API Endpoints

- GET /symbols - List all available symbols
- GET /price/:symbol - Get current price for a specific symbol
- WebSocket: ws://YOUR_SERVER_IP:8001 - Real-time price updates