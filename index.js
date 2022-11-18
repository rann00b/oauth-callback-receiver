import express from 'express';
import got from 'got';

const app = express();
const port = process.env.PORT || 3000;

app.use('/callback', async (req, res) => {
    const code = req.query.code

    if (!code || typeof code !== 'string')
        return res.end('Parameter "code" is is missing.');

    try {
        const response = await got.post('https://github.com/login/oauth/access_token', { 
            headers: {
                Accept: 'application/json',
            },
            searchParams: {
                code,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
            }
        }).json()

        res.type('html')
        res.send(`
            <div>You are now connected to GitHub!</div>
            <script>
                window.opener.postMessage('${response.access_token}', '*')
            </script>
        `)
    } catch (error) {
        console.log(error)
        res.end('Failed to get your access token :(')
    }
})

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
})