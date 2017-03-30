import AWS from 'aws-sdk-mock';

import {ls} from './ls';

beforeEach(() => {
  AWS.restore('ECS', 'listServices');
});

it('should export ls function', () => {
  expect(ls).toBeInstanceOf(Function);
});

it('should invoke listServices function', async() => {
  AWS.mock('ECS', 'listServices', {
    serviceArns: ['arn:aws:ecs:us-east-1:123456789000:service/my-service']
  });
  const services = await ls();

  expect(services).toEqual(['my-service']);
});

it('should sort services in A-Z order', async() => {
  AWS.mock('ECS', 'listServices', {
    serviceArns: [
      'arn:aws:ecs:us-east-1:123456789000:service/my-service-2',
      'arn:aws:ecs:us-east-1:123456789000:service/my-service-3',
      'arn:aws:ecs:us-east-1:123456789000:service/my-service-1'
    ]
  });
  const services = await ls();

  expect(services).toEqual([
    'my-service-1',
    'my-service-2',
    'my-service-3'
  ]);
});

it('should invoke listServices again if nextToken is present', async() => {
  AWS.mock('ECS', 'listServices', (params, cb) => {
    if (params.nextToken) {
      return cb(null, {
        serviceArns: ['arn:aws:ecs:us-east-1:123456789000:service/my-service-2']
      });
    }

    return cb(null, {
      serviceArns: ['arn:aws:ecs:us-east-1:123456789000:service/my-service-1'], nextToken: 'token'
    });
  });
  const services = await ls();

  expect(services).toEqual([
    'my-service-1',
    'my-service-2'
  ]);
});
