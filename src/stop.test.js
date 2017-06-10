import AWS from 'aws-sdk-mock';

import {stop} from './stop';

afterEach(() => {
  AWS.restore('ECS', 'updateService');
  AWS.restore('ECS', 'describeServices');
});

it('should export stop function', () => {
  expect(stop).toBeInstanceOf(Function);
});

it('should invoke updateService function', async() => {
  const updateServiceMock = jest.fn((params, cb) => {
    return cb(null, {desiredCount: 0, runningCount: 0, pendingCount: 0});
  });
  const describeServicesMock = jest.fn((params, cb) => {
    return cb(null, {
      services: [{desiredCount: 0, runningCount: 0, pendingCount: 0}]
    });
  });

  AWS.mock('ECS', 'updateService', updateServiceMock);
  AWS.mock('ECS', 'describeServices', describeServicesMock);

  await stop();

  expect(updateServiceMock).toBeCalled();
});

it('should invoke describeServices if service has pending tasks', async() => {
  const updateServiceMock = jest.fn((params, cb) => {
    return cb(null, {desiredCount: 0, runningCount: 0, pendingCount: 1});
  });
  const describeServicesMock = jest.fn((params, cb) => {
    return cb(null, {
      services: [{desiredCount: 0, runningCount: 0, pendingCount: 0}]
    });
  });

  AWS.mock('ECS', 'updateService', updateServiceMock);
  AWS.mock('ECS', 'describeServices', describeServicesMock);

  await stop();

  expect(describeServicesMock).toBeCalled();
});

it('should invoke describeServices again if service has still pending tasks', async() => {
  const updateServiceMock = jest.fn((params, cb) => {
    return cb(null, {desiredCount: 0, runningCount: 0, pendingCount: 1});
  });
  const describeServicesMock = jest.fn()
    .mockImplementationOnce((params, cb) => {
      return cb(null, {
        services: [{desiredCount: 0, runningCount: 0, pendingCount: 1}]
      });
    })
    .mockImplementationOnce((params, cb) => {
      return cb(null, {
        services: [{desiredCount: 0, runningCount: 0, pendingCount: 1}]
      });
    })
    .mockImplementationOnce((params, cb) => {
      return cb(null, {
        services: [{desiredCount: 0, runningCount: 0, pendingCount: 0}]
      });
    });

  AWS.mock('ECS', 'updateService', updateServiceMock);
  AWS.mock('ECS', 'describeServices', describeServicesMock);

  await stop();

  expect(describeServicesMock).toBeCalled();
});

it('should return 0', async() => {
  const updateServiceMock = jest.fn((params, cb) => {
    return cb(null, {desiredCount: 0, runningCount: 0, pendingCount: 1});
  });
  const describeServicesMock = jest.fn((params, cb) => {
    return cb(null, {
      services: [{desiredCount: 0, runningCount: 0, pendingCount: 0}]
    });
  });

  AWS.mock('ECS', 'updateService', updateServiceMock);
  AWS.mock('ECS', 'describeServices', describeServicesMock);

  expect(await stop()).toBe(0);
});
