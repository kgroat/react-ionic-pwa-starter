
# React Ionic PWA Starter

## Prerequisites

* NodeJS LTS (Download)[https://nodejs.org/en/]
* Docker (Download)[https://www.docker.com/community-edition] (Only required for serverless deployment)
  - If you are on MacOS / Windows, ensure that your development directory is available
  - See the documentation for (MacOS)[https://docs.docker.com/docker-for-mac/#file-sharing] or (Windows)[https://docs.docker.com/docker-for-windows/#shared-drives]

## Quickstart

To set up:
* `npm install`

To run locally:
* `npm run start:dev`

To run the tests:
* `npm test`

To build a production bundle and start the server:
* `npm run build`
* `npm start`

To build and deploy to AWS Lambda (dev/prod stage):
* `npm run serverless:dev`
* `npm run serverless:prod`

## Generators

To create a new container:
* `npm run generate:container [ContainerName]`
