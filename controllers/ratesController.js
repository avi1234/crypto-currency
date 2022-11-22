const config = require('../config')
const helpers = require('../helpers')

/**
* Parse 'from' and 'to' from the req
*/
const parseFromTo = (req, res) => {
    if(typeof req.params.from !== 'string' || typeof req.params.to !== 'string') {
        console.log('invalid input for action')
        res.status(400).send('invalid input for action')
        return {valid: false}
    }
    return {valid: true, from: req.params.from.toUpperCase(), to: req.params.to.toUpperCase()}
}

/**
* GET action for get specific rate info
*/
const getRate = async (req, res) => {
    
    //validate and parse input
    const parsedFromTo = parseFromTo(req, res)
    if(!parsedFromTo.valid) return

    let parsedTimeframe = parseInt(req.query.timeframe)

    if(isNaN(parsedTimeframe) || parsedTimeframe <=0 || parsedTimeframe > config.maxGetRatesTimeframe) {
        parsedTimeframe = config.defaultGetRatesTimeframe
    }

    const from = parsedFromTo.from  
    const to = parsedFromTo.to
    const timeframe = parsedTimeframe

    //check that specific pairing exists

    const dataFile = helpers.readDataFile()

    const rateFromdata = dataFile.find( (rate) => rate.cryptoCoinName === from)

    if(!rateFromdata) {
        res.status(404).json({success: false, version:'v1', message: "from currency doesn't exist", content:{from: from, to: to}})
        return
    }

    const relevantCurrency = rateFromdata.currencies.find( (currency) => currency.to === to)

    if(!relevantCurrency) {
        res.status(404).json({success: false, version:'v1', message: "target currency doesn't exist", content:{from: from, to: to}})
        return
    }

    const timeframeRateValues = relevantCurrency.values.filter((rateValue) => {
        return (Date.now() - new Date(rateValue.date)) <= (timeframe * 60 * 1000)
    })

    res.json({success: true, version:'v1', content: [{from: from, to: to, data: timeframeRateValues}]})
}

/**
* GET action for get specific rate info with default from and to currencies
*/
const getDefaultRate = (req, res) => {
    req.params.from = config.defaultRate.cryptoCoinName
    req.params.to = config.defaultRate.currency
    getRate(req, res)
}

/**
* DELETE action for deleting specific pair of currencies
*/
const deleteRate = (req, res) => {
    //validate and parse input
    const parsedFromTo = parseFromTo(req, res)
    if(!parsedFromTo.valid) return

    const from = parsedFromTo.from
    const to = parsedFromTo.to

    //check that specific pairing exists

    const dataFile = helpers.readDataFile()

    const rateFromdata = dataFile.find( (rate) => rate.cryptoCoinName === from)

    if(!rateFromdata) {
        res.status(404).json({success: false, version:'v1', message: "from currency doesn't exist", content:{from: from, to: to}})
        return
    }

    const relevantCurrency = rateFromdata.currencies.find( (currency) => currency.to === to)

    if(!relevantCurrency) {
        res.status(404).json({success: false, version:'v1', message: "target currency doesn't exist", content:{from: from, to: to}})
        return
    }
    
    rateFromdata.currencies = rateFromdata.currencies.filter((currency) => currency.to !== to)

    helpers.writeDataFileFromJson(dataFile)

    res.send({success: true})
}

module.exports = {getRate, getDefaultRate, deleteRate}