# AWS Lambda: Oauth Sync

Using tokens from `lambda-oauth-request-token` and `verifier` from Twitter, authorizes user, saves them to DynamoDB and generates a unique token that is returned back.

## Enviroment variables

* `TWITTER_KEY` can be found on Twitter developer page.
* `TWITTER_SECRET` can be found on Twitter developer page.
* `CALLBACK_URI` of location that the user should be redirected to after they authorize the app.
* `DDB_TABLE` that the lambda should save the user to.

## Request

[_POST_] Event body has to be a valid JSON object with following properties:

* `token`
* `token_secret`
* `verifier`

## Responses

### 200
```
{
  "token": String,
  "user": {
    "id": String,
    "image": String,
    "name": String,
    "screen_name": String
  }
}
```

###  404
The provided tokens were not valid.

###  422
One or more parameters were missing.

### 503
The database connection failed.

## Deployment
Deploy with `npm run deploy:{env}`.
