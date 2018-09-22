const endpoint = 'https://api.twitter.com/1.1/account/verify_credentials.json'

/**
 * Fetches user data from Twitter.
 *
 * @param {OAuth} oauth
 * @param {any} tokens
 *
 * @return {Promise<any>} Object with user data.
 */
module.exports = (oauth, { access_token, access_token_secret }) => {
  const auth = [ endpoint, access_token, access_token_secret ]
  return new Promise((resolve, reject) => {
    oauth.get(...auth, (error, user) => transformResponse(resolve, user, reject, error))
  })
}

/**
 * Transform oauth response into a future friendly format.
 *
 * @param {Function} reject
 * @param {any} error
 * @param {Function} resolve
 * @param {any} user
 */
const transformResponse = (resolve, user, reject, error) => {
  if (error) {
    return reject({ status: 404, error: 'InvalidTokens' })
  }

  user = JSON.parse(user)

  resolve({
    id: user.id_str,
    user: {
      image: user.profile_image_url_https,
      name: user.name,
      screen_name: user.screen_name
    }
  })
}
