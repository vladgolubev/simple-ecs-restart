import AWS from 'aws-sdk-mock';

import {lsClusters} from './ls-clusters';

afterEach(() => {
  AWS.restore('ECS', 'listClusters');
});

it('should export lsClusters function', () => {
  expect(lsClusters).toBeInstanceOf(Function);
});

it('should invoke listCluster function', async () => {
  const listClustersMock = jest.fn((params, cb) => {
    return cb(null, {
      clusterArns: [
        'arn:aws:ecs:us-east-1:123456789000:cluster/second',
        'arn:aws:ecs:us-east-1:123456789000:cluster/first'
      ], nextToken: null
    });
  });
  AWS.mock('ECS', 'listClusters', listClustersMock);

  const clusters = await lsClusters();

  expect(clusters).toEqual(['first', 'second']);
});
