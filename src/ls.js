import {ECS} from 'aws-sdk';

let ecs;

export async function ls(region = 'us-east-1', cluster = '', nextToken = '') {
  if (!ecs) {
    ecs = new ECS({region});
  }

  const {serviceArns, nextToken: recentNextToken} = await ecs.listServices({
    cluster,
    nextToken
  }).promise();

  if (recentNextToken) {
    serviceArns.push(...await ls(region, cluster, recentNextToken));
  }

  return serviceArns;
}
