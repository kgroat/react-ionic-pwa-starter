
# React Ionic PWA Starter

## Prerequisites

* NodeJS LTS [Download](https://nodejs.org/en/)
* Docker [Download](https://www.docker.com/community-edition) (Only required for serverless deployment on MacOS and Windows)
  - If you are on MacOS / Windows, ensure that your development directory is mountable by docker
  - See the documentation for [MacOS](https://docs.docker.com/docker-for-mac/#file-sharing) or [Windows](https://docs.docker.com/docker-for-windows/#shared-drives)

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
* `BASE_URL='/stage/' STAGE='stage' npm run serverless:docker` - deploy to specified stage with specified base URL

To build and deploy to AWS Lambda on linux:
* `BASE_URL='/stage/' STAGE='stage' npm run serverless:linux` - deploy to specified stage with specified base URL

## Generators

To create a new React container:
* `npm run generate:container [ContainerName]`
  - Note: the word `View` will automatically be appended to your `ContainerName`
