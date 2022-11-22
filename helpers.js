const fs = require('fs')

const config = require('./config')

const helpers = {}

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
