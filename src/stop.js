import {ECS} from 'aws-sdk';

let ecs;

export async function stop(region = 'us-east-1', cluster = '', service = 'ß') {
  if (!ecs) {
    ecs = new ECS({region});
  }

  const {desiredCount, runningCount, pendingCount} = await ecs.updateService({cluster, service, desiredCount: 0}).promise();

  return runningCount;
}
