const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB()
const uuid = require('uuid/v4')
const crypto = require('crypto')

/**
 * Updates or inserts user to the dabatase.
 *
 * @param {any} user
 *
 * @return {Promise<any>}
 */
module.exports = ({ id, user }) => {
  // Generates a random user token.
  const token = crypto
    .createHash('sha256')
    .update(`${user.twitter_id}-${uuid()}-${Date.now()}`)
    .digest('hex')

  user.pp_token = token

  const item = {
    TableName: process.env.DDB_TABLE,
    Key: {
     user_id: { S: id }
    },
    ReturnValues: 'ALL_NEW',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  }

  const exp = []

  // Adds all aquired attributes to the update query.
  for (let attribute in user) {
    let value = user[attribute]

    if (! value) {
      continue
    }

    exp.push(`#${attribute} = :_${attribute}`)

    item.ExpressionAttributeNames[`#${attribute}`] = attribute
    item.ExpressionAttributeValues[`:_${attribute}`] = { S: value }
  }

  item.UpdateExpression = 'SET ' + exp.join(',')

  return new Promise((resolve, reject) => {
    ddb.updateItem(item, (err, _) => err
      ? reject({ status: 503, error: 'ServiceUnavailable' })
      : resolve({ id: user.twitter_id, pp_token: token })
    )
  })
}
