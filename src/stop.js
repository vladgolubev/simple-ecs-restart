import {ECS} from 'aws-sdk';
import Promise from 'bluebird';

let ecs;

export async function stop(region = 'us-east-1', cluster = '', service = 'ß') {
  if (!ecs) {
    ecs = new ECS({region});
  }

  await shutdown(cluster, service);
  await waitForShutdown(cluster, service);

  return 0;
}

async function shutdown(cluster, service) {
  await ecs.updateService({cluster, service, desiredCount: 0}).promise();
}

async function waitForShutdown(cluster, service) {
  const servicesStatus = await ecs.describeServices({cluster, services: [service]}).promise();

  const {runningCount, pendingCount} = servicesStatus.services[0];

  if (runningCount !== 0 || pendingCount !== 0) {
    await Promise.delay(1000);
    await waitForShutdown(cluster, service);
  }
}
