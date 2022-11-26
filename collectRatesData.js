const axios = require('axios')

const config = require('./config')
const helpers = require('./helpers')

const run = () => {
    console.log('✋ Init the collect rates data')

    const initialState = [{cryptoCoinName: 'BTC', currencies:[{to:'USD', values:[]},{to:'EUR', values:[]}]},{cryptoCoinName: 'ETH', currencies:[{to:'USD', values:[]},{to:'EUR', values:[]}]}]

    helpers.writeDataFile(initialState)

    console.log('🔆 Starting to collect rates data')

    const collectWorker = async () => {
        const data = helpers.readDataFile()

        await Promise.all(data.map(async (rate) => {
            console.log(`fetching data for 💰 ${rate.cryptoCoinName}`)
            const fetchDate = new Date()

            let ratesFromAPI = null

            try {
                const res = await axios.get(config.ratesAPIUrl(rate.cryptoCoinName))
                ratesFromAPI = res.data.data.rates
            } catch(e) {
                //implement errors/retry handling
                console.log(`error while fetching api results, ${e}`)
                return
            }

            if (!ratesFromAPI) return

            rate.currencies.forEach( currency => {
                const exchangeRate = ratesFromAPI[currency.to]
                if(exchangeRate) {
                    console.log(`update rate for 💰 ${rate.cryptoCoinName} => ${currency.to}`)
                    currency.values.push({date: fetchDate, rate: exchangeRate})
                }
            })
        }))

        helpers.writeDataFile(data)
    }

     collectWorker()

     setInterval(collectWorker, config.fetchItervalsInSeconds * 1000);
}

// const storage = {
//     BTC: {
//         currencies: {
//             USD: {
//                 rates: {
//                     '2022-11-22T11:34': 3.22
//                 },
//             }
//         }
//     }
// }

module.exports = { run }