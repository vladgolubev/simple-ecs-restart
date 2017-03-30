import {ECS} from 'aws-sdk';
import parseArn from 'aws-arn-parser';

let ecs;

export async function ls(region = 'us-east-1', cluster = '', nextToken = '') {
  if (!ecs) {
    ecs = new ECS({region});
  }

  const services = [];
  const {serviceArns, nextToken: recentNextToken} = await ecs.listServices({
    cluster,
    nextToken
  }).promise();

  services.push(...getServicesFromArns(serviceArns));

  if (recentNextToken) {
    services.push(...await ls(region, cluster, recentNextToken));
  }

  return services;
}

function getServicesFromArns(arns) {
  return arns
    .map(parseArn)
    .map(arn => arn.relativeId.replace(new RegExp('^service/'), ''))
    .sort();
}
