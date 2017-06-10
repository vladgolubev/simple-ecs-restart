import {ECS} from 'aws-sdk';
import parseArn from 'aws-arn-parser';

let ecs;

export async function lsClusters(region = 'us-east-1') {
  if (!ecs) {
    ecs = new ECS({region});
  }

  // Ignoring nextToken. Unlikely someone has >100 clusters...
  const {clusterArns} = await ecs.listClusters({}).promise();

  return getClustersFromArns(clusterArns);
}

function getClustersFromArns(arns) {
  return arns
    .map(parseArn)
    .map(arn => arn.relativeId.replace(new RegExp('^cluster/'), ''))
    .sort();
}
