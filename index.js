const express = require('express');
const logging = require('express-logging');
const logger = require('logops');

const app = express();
const port = process.env.PORT || 3000;

app.use(logging(logger))
app.use('/api/callback', (req, res) => {
    res.end('Callback received.')
})

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
})