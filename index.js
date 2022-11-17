const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use('/callback', async (req, res) => {
    const code = req.query.code

    if (!code || typeof code !== 'string')
        return res.end('Parameter "code" is is missing.');

    console.log({ env: process.env })

    const response = await axios.default({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token',
        params: {
            code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
        },
        responseType: 'text'
    })

    console.log({ response })

    res.end('Your access token is: ', response)
})

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
})