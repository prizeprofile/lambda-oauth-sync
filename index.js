const OAuth = require('oauth').OAuth
const fetchUserData = require('./src/fetchUserData')
const findOrNewUser = require('./src/findOrNewUser')

exports.handler = (event, _, callback) => {
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
    try {
      let t = JSON.parse(event.body)

      // Checks if all three tokens exist.
      t.token.length && t.token_secret.length && t.verifier.length && resolve(t)

      throw new Error()
    } catch (_) {
      reject({ status: 422, error: 'MissingParameters' })
    }
  })
    .then(({ token, token_secret, verifier }) => {
      return new Promise((resolve, reject) => {
        // Exchanging request token for access token.
        oauth.getOAuthAccessToken(token, token_secret, verifier,
        (error, access_token, access_token_secret) => {
          error
            ? reject({ status: 401, error: 'InvalidTokens' })
            : resolve({ access_token, access_token_secret })
        })
    })})
    // Makes a request to Twitter for user info.
    .then(tokens => fetchUserData(oauth, tokens))
    // Creates/updates DynamoDB user and returns a unique token.
    .then(findOrNewUser)
    .then(res => callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin' : '*'
      },
      body: JSON.stringify(res)
    }))
    .catch(({ error, status }) => callback(null, {
      statusCode: status,
      headers: {
        'Access-Control-Allow-Origin' : '*'
      },
      body: JSON.stringify({ status, error })
    }))
}
