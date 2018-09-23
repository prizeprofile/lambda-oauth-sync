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
    oauth.get(...auth, (error, user) => {
      if (error) {
        return reject({ status: 404, error: 'InvalidTokens' })
      }

      user = JSON.parse(user)

      resolve({
        tokens: { access_token, access_token_secret },
        user: {
          id: user.id_str,
          image: user.profile_image_url_https,
          name: user.name,
          screen_name: user.screen_name
        }
      })
    })
  })
}
