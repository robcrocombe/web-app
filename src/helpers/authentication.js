import _passport from 'passport';
import GitHubStrategy from 'passport-github2';
import log from '../log';
import * as api from '../helpers/api';

export const passport = _passport;

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Not logged in
  return res.redirect('/login');
}

// TODO: fix /login if you are already logged in

export function avatarFromCookie(req, res, next) {
  /* eslint-disable no-param-reassign */
  if (req.isAuthenticated()) {
    res.locals.user_avatar_url = req.cookies.user_avatar_url;
  }
  next();
  /* eslint-enable no-param-reassign */
}

function authenticateWithAPI(service, accessToken, done) {
  api.get('authentication/token', null, {
    username: service,
    password: accessToken
  })
  .then(res => {
    done(null, res);
  })
  .catch(err => {
    done(err);
  });
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// GitHub auth
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback'
},
(accessToken, refreshToken, profile, done) => {
  log.info(accessToken, refreshToken, profile, 'Authenticated with service');
  authenticateWithAPI('github', accessToken, done);
}));
