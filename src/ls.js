import {ECS} from 'aws-sdk';

let ecs;

export async function ls(region = 'us-east-1', cluster = '') {
  if (!ecs) {
    ecs = new ECS({region});
  }

  return await ecs.listServices({cluster}).promise();
}
