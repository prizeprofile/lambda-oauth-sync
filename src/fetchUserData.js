const endpoint = 'https://api.twitter.com/1.1/account/verify_credentials.json'

/**
 * Fetches user data from Twitter.
 *
 * @param {OAuth} oauth
 * @param {any} tokens
 *
 * @return {any} Object with user data.
 */
exports.default = (oauth, { access_token, access_token_secret }) => {
  return new Promise((resolve, reject) => {
    oauth.get(
      endpoint,
      access_token,
      access_token_secret,
      (error, user) => error
        ? reject({ status: 404, error: 'InvalidTokens' })
        : console.log('user', user, resolve({
          image: user.profile_image_url_https,
          twitter_id: user.id_str,
          name: user.name,
          screen_name: user.screen_name
        }))
    )
  })
}
