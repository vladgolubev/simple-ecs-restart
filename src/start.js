import {ECS} from 'aws-sdk';
import Promise from 'bluebird';

let ecs;

export async function start(region = 'us-east-1', cluster = '', service = 'ß') {
  if (!ecs) {
    ecs = new ECS({region});
  }

  await startup(cluster, service);
  await waitForStartup(cluster, service);

  return 1;
}

async function startup(cluster, service) {
  await ecs.updateService({cluster, service, desiredCount: 1}).promise();
}

async function waitForStartup(cluster, service) {
  const servicesStatus = await ecs.describeServices({cluster, services: [service]}).promise();

  const {runningCount} = servicesStatus.services[0];

  if (runningCount !== 1) {
    await Promise.delay(1000);
    await waitForStartup(cluster, service);
  }
}
