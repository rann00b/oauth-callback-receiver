import got from 'got';
import pkce from 'pkce-challenge';
import { nanoid } from 'nanoid';
import qs from 'qs';

/**
 * @param {import('express').Application} app
 */
export function gitlabRoute(app) {
  app.post('/gitlab/authorize', (req, res) => {
    console.log(process.env.COOKIE_PARSER_SECRET);

    const challenge = pkce.default();
    const state = nanoid();
    const cookieOptions = { maxAge: 1000 * 60 * 5, signed: true };
    const query = qs.stringify({
      client_id: process.env.GITLAB_CLIENT_ID,
      redirect: 'https://oauth-callback-receiver.vercel.app/gitlab/callback',
      response_type: 'code',
      state,
      scope: 'api read_api read_user read_repository write_repository',
      code_challenge_method: 'S256',
      code_challenge: challenge.code_challenge,
    });

    res.cookie('code_verifier', challenge.code_verifier, cookieOptions);
    res.cookie('state', state, cookieOptions);
    res.redirect('https://gitlab.com/oauth/authorize?' + query);
  });

  app.use('/gitlab/callback', async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    if (!code || typeof code !== 'string') return res.end('Parameter "code" is missing.');
    if (!state || typeof state !== 'string') return res.end('Parameter "state" is missing.');
    if (!req.cookies.state) return res.end('Cookie "state" is missing.');
    if (!req.cookies.code_verifier) return res.end('Cookie "code_verifier" is missing.');
  });
}
