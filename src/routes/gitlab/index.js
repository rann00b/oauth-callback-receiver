import got from 'got';
import { nanoid } from 'nanoid';
import qs from 'qs';

/**
 * @param {import('express').Application} app
 */
export function gitlabRoute(app) {
  const states = new Map();
  const redirectUri = 'https://oauth-callback-receiver.vercel.app/gitlab/callback';

  app.use('/gitlab/authorize', (req, res) => {
    const state = nanoid();
    const query = qs.stringify({
      client_id: process.env.GITLAB_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      state,
      scope: 'api read_api read_user read_repository write_repository',
    });

    states.set(state, true);

    res.redirect('https://gitlab.com/oauth/authorize?' + query);
  });

  app.use('/gitlab/callback', async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    if (!code || typeof code !== 'string') return res.end('Parameter "code" is missing.');
    if (!state || typeof state !== 'string') return res.end('Parameter "state" is missing.');
    if (!states.has(state)) res.end('State mismatch.');

    try {
      const response = await got
        .post('https://gitlab.com/oauth/token', {
          searchParams: {
            client_id: process.env.GITLAB_CLIENT_ID,
            client_secret: process.env.GITLAB_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
          },
        })
        .json();

      res.type('html');
      res.send(`
        <div>You are now connected to GitLab!</div>
        <script>window.opener.postMessage('${JSON.stringify(response)}', '*')</script>`);
    } catch (error) {
      console.log(error);
      res.end('Failed to get your access token.');
    }
  });
}
