module.exports = {
    fetchItervalsInSeconds: 60,
    defaultRate: {cryptoCoinName: 'BTC', currency: 'USD'},
    defaultGetRatesTimeframe: 5,
    maxGetRatesTimeframe: 1000,
    ratesAPIUrl: (cryptoCoinName) => `https://api.coinbase.com/v2/exchange-rates?currency=${cryptoCoinName}`,
    dataFile: 'data.json',
    port: 3001
}