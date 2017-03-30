import {ECS} from 'aws-sdk';

let ecs;

export async function stop(region = 'us-east-1', cluster = '', service = 'ß') {
  if (!ecs) {
    ecs = new ECS({region});
  }

  return ecs.updateService({cluster, service, desiredCount: 0}).promise();
}
