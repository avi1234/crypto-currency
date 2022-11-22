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
