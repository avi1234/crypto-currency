const fs = require('fs')

const config = require('./config')

const loggerImpl = (level, message) => console.log(`🦒 [${level}] ${message}`)

const helpers = {}

helpers.logger = {
    debug: (message) => loggerImpl('debug', message),
    info: (message) => loggerImpl('info', message),
    warn: (message) => loggerImpl('warn', message),
    error: (message) => loggerImpl('❌error', message)
}

/**
* Retry the relevant action X times in case of error
*/
helpers.retry = async (action, numOfTries = 3) => {
    let triesCounter = 1;
    let runSuccessfuly = false
    while(triesCounter <= numOfTries){
        try {
            await action()
            runSuccessfuly = true
            break;
        } catch (err) {
            helpers.logger.error(`retry #${triesCounter}: ${err}`)
        }
        triesCounter++
    }

    return runSuccessfuly
}

/**
* create the data file with defaults values
*/
helpers.createDataFile = () => {
    fs.writeFileSync(config.dataFile, JSON.stringify(config.rates))
}

helpers.readDataFileAsJson = () => {
    return JSON.parse(fs.readFileSync(config.dataFile, { encoding: "utf8", flag: "r" }))
}

helpers.writeDataFileFromJson = (json) => {
    fs.writeFileSync(config.dataFile, JSON.stringify(json))
}

module.exports = helpers
