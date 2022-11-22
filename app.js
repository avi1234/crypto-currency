const express = require('express')
const morgan = require('morgan')

const config = require('./config')

const ratesRouter = require('./routes/ratesRoutes')

const app = express()

app.use(morgan('tiny'))
app.use('/api/rates', ratesRouter)

app.listen(config.port, () => console.log(`🆗 server is up on port ${config.port}`))