/**
 * @param {import('express').Application} app
 */
export function bitbucketRoute(app) {
  const clientId = process.env.BITBUCKET_CLIENT_ID;
  const clientSecret = process.env.BITBUCKET_CLIENT_SECRET;
  const digested = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  app.use('/bitbucket/callback', async (req, res) => {
    const code = req.query.code;

    if (!code || typeof code !== 'string') return res.end('Parameter "code" is is missing.');

    try {
      const response = await got
        .post('https://bitbucket.org/site/oauth2/access_token', {
          headers: { Authorization: `Basic ${digested}` },
          form: { code, grant_type: 'authorization_code' },
        })
        .json();

      res.type('html');
      res.send(`
        <div>You are now connected to Bitbucket!</div>
        <script>window.opener.postMessage('${JSON.stringify(response)}', '*')</script>`);
    } catch (error) {
      console.log(error);
      res.end('Failed to get your access token.');
    }
  });

  app.post('/bitbucket/refresh_token', async (req, res) => {
    const refreshToken = req.query.refreshToken;

    if (!refreshToken || typeof refreshToken !== 'string') return res.end('Parameter "refreshToken" is is missing.');

    try {
      const response = await got
        .post('https://bitbucket.org/site/oauth2/access_token', {
          headers: { Authorization: `Basic ${digested}` },
          form: { refresh_token: refreshToken, grant_type: 'refresh_token' },
        })
        .json();

      res.type('json');
      res.send(response);
    } catch (error) {
      console.log(error);
      res.end('Failed to get your refresh token.');
    }
  });
}
