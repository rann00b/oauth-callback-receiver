const express = require('express');
const morgan = require('morgan');


const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'))
app.use('/api/callback', (req, res) => {
    res.end('Callback received.')
})

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
})