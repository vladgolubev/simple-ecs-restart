# Simple ECS restart

## Features

This module contains logic for CLI: [simple-ecs-restart-cli](https://github.com/vladgolubev/simple-ecs-restart-cli)

It has serious trade-offs. This is considered for local development only.

* Red/green deployment. 1 -> 0 -> 1
* With the same task definition
* So it will pickup newest `latest` tag of docker image

If you want more features, such as green/blue deployment, setting env vars, different tags
then look at [ecs-deploy](https://github.com/fabfuel/ecs-deploy) project.

## Usage

```javascript
const ser = require('simple-ecs-restart');

await ser.ls('us-east-1', 'dev');
await ser.stop('us-east-1', 'dev', 'my-service');
await ser.start('us-east-1', 'dev', 'my-service');
```
