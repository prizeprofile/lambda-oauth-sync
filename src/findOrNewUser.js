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
module.exports = ({ user, tokens }) => {
  // Generates a random user token.
  const token = crypto
    .createHash('sha256')
    .update(`${user.id}-${uuid()}-${Date.now()}`)
    .digest('hex')

  tokens.pp_token = token

  const item = {
    TableName: process.env.DDB_TABLE,
    Key: {
     user_id: { S: user.id }
    },
    ReturnValues: 'ALL_NEW',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  }

  const exp = []

  const attributes = Object.assign({}, tokens, user, { id: undefined })

  // Adds all aquired attributes to the update query.
  for (let attribute in attributes) {
    let value = attributes[attribute]

    if (value === undefined) {
      continue
    }

    exp.push(`#${attribute} = :_${attribute}`)

    item.ExpressionAttributeNames[`#${attribute}`] = attribute
    item.ExpressionAttributeValues[`:_${attribute}`] = { S: value }
  }

  item.UpdateExpression = 'SET ' + exp.join(', ')

  return new Promise((resolve, reject) => {
    ddb.updateItem(item, (err, _) => err
      ? reject({ status: 503, error: 'ServiceUnavailable' })
      : resolve({
        token: `${user.id},${token}`,
        user
      })
    )
  })
}
