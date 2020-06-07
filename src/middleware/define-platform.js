import Environment from '@/env/environment';

function definePlatform(req, res, next) {
  const origin = req.get('origin') || '';
  const appKey = req.headers['app-key'];

  const allowOrigin = !!origin && Environment.allowedDomains.includes(origin);
  const allowApp = !!appKey && Environment.appKey === appKey;

  if (allowOrigin) {
    req.clientType = 0;
    req.origin = origin;
  } else if (allowApp) {
    req.clientType = 1;
  }

  if (allowOrigin || allowApp) {
    next();
  }
}

export default definePlatform;
