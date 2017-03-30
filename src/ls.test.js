import AWS from 'aws-sdk-mock';

import {ls} from './ls';

beforeEach(() => {
  AWS.restore('ECS', 'listServices');
});

it('should export ls function', () => {
  expect(ls).toBeInstanceOf(Function);
});

it('should invoke listServices function', async() => {
  AWS.mock('ECS', 'listServices', {serviceArns: ['1']});
  const services = await ls();

  expect(services).toEqual(['1']);
});

it('should sort services in A-Z order', async() => {
  AWS.mock('ECS', 'listServices', {serviceArns: ['2', '3', '1']});
  const services = await ls();

  expect(services).toEqual(['1', '2', '3']);
});

it('should invoke listServices again if nextToken is present', async() => {
  AWS.mock('ECS', 'listServices', (params, cb) => {
    if (params.nextToken) {
      return cb(null, {serviceArns: ['2']});
    }

    return cb(null, {serviceArns: ['1'], nextToken: 'token'});
  });
  const services = await ls();

  expect(services).toEqual(['1', '2']);
});
