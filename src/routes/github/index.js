/**
 * @param {import('express').Application} app
 */
export function githubRoute(app) {
  app.use('github/callback', async (req, res) => {
    const code = req.query.code;

    if (!code || typeof code !== 'string')
      return res.end('Parameter "code" is is missing.');

    try {
      const response = await got
        .post('https://github.com/login/oauth/access_token', {
          headers: {
            Accept: 'application/json',
          },
          searchParams: {
            code,
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
          },
        })
        .json();

      res.type('html');
      res.send(`
        <div>You are now connected to GitHub!</div>
        <script>window.opener.postMessage('${response.access_token}', '*')</script>`);
    } catch (error) {
      res.end('Failed to get your access token.');
    }
  });
}
