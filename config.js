module.exports = {
    rates: [{cryptoCoinName: 'BTC', currencies:[{to:'USD', values:[]},{to:'EUR', values:[]}]},{cryptoCoinName: 'ETH', currencies:[{to:'USD', values:[]},{to:'EUR', values:[]}]}],
    fetchItervalsInSeconds: 60,
    defaultRate: {cryptoCoinName: 'BTC', currency: 'USD'},
    defaultGetRatesTimeframe: 5,
    maxGetRatesTimeframe: 1000,
    ratesAPIUrl: (cryptoCoinName) => `https://api.coinbase.com/v2/exchange-rates?currency=${cryptoCoinName}`,
    dataFile: 'data.json',
    port: 3001
}