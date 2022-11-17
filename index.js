const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use('/callback', (req, res) => {
    console.log(JSON.stringify({
        params: req.query,
        headers: req.headers,
        body: req.body,
    }, null, 2))

    res.end('Callback received.')
})

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
})