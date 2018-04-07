
# React Ionic PWA Starter

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![CircleCI](https://circleci.com/gh/kgroat/react-ionic-pwa-starter.svg?style=svg)](https://circleci.com/gh/kgroat/workflows/react-ionic-pwa-starter)
[![Coverage Status](https://coveralls.io/repos/github/kgroat/react-ionic-pwa-starter/badge.svg?branch=master)](https://coveralls.io/github/kgroat/react-ionic-pwa-starter)


## Prerequisites

* NodeJS LTS ([Download](https://nodejs.org/en/) - Required)
* Docker ([Download](https://www.docker.com/community-edition) - Only required for serverless deployment on MacOS and Windows)
  - If you are on MacOS / Windows, ensure that your development directory is mountable by docker
  - See the documentation for [MacOS](https://docs.docker.com/docker-for-mac/#file-sharing) or [Windows](https://docs.docker.com/docker-for-windows/#shared-drives)
* MongoDB Community Server ([Download](https://www.mongodb.com/download-center/#community)  - Optional)
  - You can use a service such as [mLab](https://mlab.com/) instead.  See `MONGO_URL` under the [Project Secrets -> Secrets include](https://github.com/kgroat/react-ionic-pwa-starter#secrets-include) section for more information.

## Using this repository as a starter

Clone the project using git:
* `git clone -b master --single-branch https://github.com/kgroat/react-ionic-pwa-starter.git my-pwa` - Clone the `master` branch into a folder named `my-pwa`
* `rm -rf .git` - Get rid of the git data associated with the original repository
* `git init` - Re-initialize the directory as a local git repository

From there, you can add your own remote and push the code:
* `git remote add origin [your-repo-url]` - Add your own repository as the origin remote (`your-repo-url`)
* `git commit -m 'Initial commit' && git push -u origin master` - Create and push your initial commit

Before you do, you will want to update project details:
* In `package.json`, you'll want to update:
  * `name` - a unique identifier (should be [kebab-case](http://wiki.c2.com/?KebabCase))
  * `appName` - The title for you application (Used in the `<title />` tag of your PWA)
  * `pushEmail` - The email used for registering push notifications, in a `mailto:` url
  * `noreplyEmail` - The default email used when sending through [`nodemailer`](https://nodemailer.com/)
  * `description` - A brief description of your project (Optional)
* In README.md:
  * Update the title (should be the same as `appName` from your `package.json`)
  * Update / remove the badges (Serverless, CircleCI, Coveralls)
  * Remove this section ("Using this repository as a starter")
* In `src/static/mainifest.json`, update:
  * `name` - Should be the same as `appName` from your `package.json`
  * `short_name` - This is what the app's name will show up as when installed on a device
  * `gcm_sender_id` - If you're using [GCM or FCM keys for push notificaitons](https://firebase.google.com/docs/cloud-messaging/concept-options) (You do NOT need to add firebase to the project for this to work)
* Update your static image assets
  * You can store large asset files in the `assets` directory -- it currently houses the source icon Photoshop document
  * In `src/static`, you'll want to replace `badge.png`, `icon.png`, and `favicon.ico`
    - NOTE: `favicon.ico` can be generated from a 512x512 `icon.png` in this directory using the `npm run icon` command
* If you're not using CircleCI, you will want to remove the `circle.yml` file at the root of the project


## Quickstart

To set up:
* `npm install`

To run locally:
* `npm run start:dev`

To run the tests:
* `npm test`

To test a production bundle locally:
* `npm run build`
* `npm start`

To build and deploy to AWS Lambda on MacOS or Windows (Docker required):
* `npm run serverless:dev` - deploys to dev stage
* `npm run serverless:prod` - deploys to prod stage
* `BASE_URL='/stage/' STAGE='stage' npm run serverless:docker` - deploy to specified stage with specified [base URL](https://www.w3schools.com/tags/tag_base.asp)

To build and deploy to AWS Lambda on linux:
* `BASE_URL='/stage/' STAGE='stage' npm run serverless:linux` - deploy to specified stage with specified base URL

If you want to use a specific AWS profile to deploy, simply specify the `AWS_PROFILE` environment variable:
* `AWS_PROFILE='myProfile' npm run serverless:dev`


## Project Secrets

In order to run, build, or deploy the application, you'll need to supply some secrets.

### __NOTE__: These secrets __SHOULD NOT__ be committed into your repository.

#### The secrets will live in a few different places:
* A `.env` file at the root of the project for local development (used when running `npm run start:dev` or `npm run build`)
  - Use the [`dotenv` format](https://www.npmjs.com/package/dotenv#usage)
* A `secrets.yml` file at the root of the project (used when deploying using `npm run serverless:*` commands)
  - See `example-secrets.yml` for an example of what this file should look like
* Your CircleCI [environment variables](https://circleci.com/docs/2.0/env-vars/) (if you use CircleCI)


#### Secrets include:
* `AUTH_SECRET` - (Required) The secret used for encrypting and decrypting [JWT](https://jwt.io/) tokens, used for user authentication
  - It is reccommended to use a long (~128 characters), randomly-generated string.  You can use a random generator such as [random.org](https://www.random.org/strings/?num=5&len=20&digits=on&upperalpha=on&loweralpha=on&unique=off&format=html&rnd=new) and concatenate the results together.
* `FCM_KEY` - (Optional) Used for registering push notification clients, if using [GCM or FCM keys for push notificaitons](https://firebase.google.com/docs/cloud-messaging/concept-options) (You do NOT need to add firebase to the project for this to work)
* `MONGO_URL` - (Required for production) The URL (including database name) of the `mongod` instance you want to connect to
  - Leave this out of your `.env` file if you just want to connect to a [locally-running `mongod` instance](https://docs.mongodb.com/manual/reference/program/mongod/index.html)
  - You can use a service such as [mLab](https://mlab.com/) to host a database, if you want a remote database instead
* `NODE_ENV` - (Optional) If this is anything except `production`, development mode is enabled -- you can use the `__DEV__` variable to make certain portions of code only run while in development mode.
* `PASSWORD_SALT_ITERATIONS` - (Reccommended) The cost number for [`bcrypt` key expansion](https://en.wikipedia.org/wiki/Bcrypt#Description) used when hashing and checking passwords.
  - If not provided, a default of 10 is used.  This is fine for local development, but [may not be sufficient for production environments](https://security.stackexchange.com/questions/3959/recommended-of-iterations-when-using-pkbdf2-sha256/3993#3993)
* `TRANSPORT_AUTH` - (Required) A JSON string used as the authentication for [`nodemailer`](https://nodemailer.com/) in production.
  - In development mode, [Etherial Email](https://ethereal.email/) is used, and the resulting URLS logged to `STDOUT`
* `BASE_URL` - (Optional) The [base URL](https://www.w3schools.com/tags/tag_base.asp) for the application.  `serverless` uses [AWS API Gateway](https://aws.amazon.com/api-gateway/), which sets the base URL to be the same as the stage name.
  - If not provided, defaults to `/`.  This works fine for local development; it may also work for production, if you [use a custom domain name](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-custom-domains.html) with a base path of `/`.  If you use a base path other than `/`, specify that path as your `BASE_URL` variable during deployments instead.


## Generators

To create a new React container:
* `npm run generate:container [ContainerName]`
  - Note: the word `View` will automatically be appended to your `ContainerName`
