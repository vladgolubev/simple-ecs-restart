import AWS from 'aws-sdk-mock';

import {stop} from './stop';

beforeEach(() => {
  AWS.restore('ECS', 'updateService');
});

it('should export stop function', () => {
  expect(stop).toBeInstanceOf(Function);
});

it('should invoke updateService function', async() => {
  AWS.mock('ECS', 'updateService', {desiredCount: 0, runningCount: 0, pendingCount: 0});

  const response = await stop();
  expect(response).toBe(0);
});
