const axios = require('axios')

const config = require('./config')
const helpers = require('./helpers')

const runLogic = () => {
    console.log('✋ Init the collect rates data')

    helpers.writeDataFileFromJson(config.rates)

    console.log('🔆 Starting to collect rates data')

    const collectWorker = async () => {
        const dataAsJson = helpers.readDataFileAsJson()

        for(let iOfDataAsJson in dataAsJson) {
            const rate = dataAsJson[iOfDataAsJson]
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

            if (ratesFromAPI == null) continue

            rate.currencies.forEach( currency => {
                const exchangeRate = ratesFromAPI[currency.to]
                if(typeof exchangeRate !== 'undefined') {
                    console.log(`update rate for 💰 ${rate.cryptoCoinName} => ${currency.to}`)
                    currency.values.push({date: fetchDate, rate: exchangeRate})
                }
            })
        }

        helpers.writeDataFileFromJson(dataAsJson)
    }

     collectWorker()

     setInterval(collectWorker, config.fetchItervalsInSeconds * 1000);
}

module.exports = {run: runLogic}