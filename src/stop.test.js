import AWS from 'aws-sdk-mock';

import {stop} from './stop';

beforeEach(() => {
  AWS.restore('ECS', 'updateService');
});

it('should export stop function', () => {
  expect(stop).toBeInstanceOf(Function);
});

it('should invoke updateService function', async() => {
  AWS.mock('ECS', 'updateService', 'updated');

  const response = await stop();
  expect(response).toBe('updated');
});
