const axios = require('axios')

const config = require('./config')
const helpers = require('./helpers')

const run = () => {
    console.log('✋ Init the collect rates data')

    const initialState = [{cryptoCoinName: 'BTC', currencies:[{to:'USD', values:[]},{to:'EUR', values:[]}]},{cryptoCoinName: 'ETH', currencies:[{to:'USD', values:[]},{to:'EUR', values:[]}]}]

    helpers.writeDataFileFromJson(initialState)

    console.log('🔆 Starting to collect rates data')

    const collectWorker = async () => {
        const data = helpers.readDataFile()

        for(let iOfData in data) {
            const rate = data[iOfData]
            console.log(`fetching data for 💰 ${rate.cryptoCoinName}`)
            const fetchDate = new Date()

            let ratesFromAPI = null

            try {
                const res = await axios.get(config.ratesAPIUrl(rate.cryptoCoinName))
                ratesFromAPI = res.data.data.rates
            } catch(e) {
                //implement errors/retry handling
                console.log(`error while fetching api results, ${e}`)
                continue
            }

            if (!ratesFromAPI) continue

            rate.currencies.forEach( currency => {
                const exchangeRate = ratesFromAPI[currency.to]
                if(exchangeRate) {
                    console.log(`update rate for 💰 ${rate.cryptoCoinName} => ${currency.to}`)
                    currency.values.push({date: fetchDate, rate: exchangeRate})
                }
            })
        }

        helpers.writeDataFileFromJson(data)
    }

     collectWorker()

     setInterval(collectWorker, config.fetchItervalsInSeconds * 1000);
}

module.exports = { run }