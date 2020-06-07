function checkCors(req, res, next) {
  if (req.clientType === 0) {
    res.header('Access-Control-Allow-Origin', req.origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', '*');

  next();
}

export default checkCors;
