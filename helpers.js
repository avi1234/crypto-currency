const fs = require('fs')

const config = require('./config')

const helpers = {}

helpers.readDataFile = () => {
    return JSON.parse(fs.readFileSync(config.dataFile, { encoding: "utf8", flag: "r" }))
}

helpers.writeDataFile = (json) => {
    console.log("🌺 writing to data file")
    fs.writeFileSync(config.dataFile, JSON.stringify(json))
}

module.exports = helpers
