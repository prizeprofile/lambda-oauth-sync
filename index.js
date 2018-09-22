const OAuth = require('oauth').OAuth

exports.handler = (_event, _context, callback) => {
  // Prepare auth object.
  const oauth = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.TWITTER_KEY,
    process.env.TWITTER_SECRET,
    '1.0',
    process.env.CALLBACK_URI,
    'HMAC-SHA1'
  )

  return new Promise((resolve, reject) => {
    // Getting request token from Twitter.
    oauth.getOAuthRequestToken((error, token, token_secret) => {
      error ? reject(error) : resolve({ token, token_secret })
    })
  })
    .then(res => callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin' : '*'
      },
      body: JSON.stringify(res)
    }))
    .catch(error => callback(null, {
      statusCode: 503,
      headers: {
        'Access-Control-Allow-Origin' : '*'
      },
      body: JSON.stringify({
        status: 503,
        error: 'Service temporarily unavailable.'
      })
    }))
}
