import AWS from 'aws-sdk-mock';

import {start} from './start';

beforeEach(() => {
  AWS.restore('ECS', 'updateService');
  AWS.restore('ECS', 'describeServices');
});

it('should export start function', () => {
  expect(start).toBeInstanceOf(Function);
});

it('should invoke updateService function', async() => {
  const updateServiceMock = jest.fn((params, cb) => {
    return cb(null, {desiredCount: 1, runningCount: 1, pendingCount: 0});
  });
  const describeServicesMock = jest.fn((params, cb) => {
    return cb(null, {
      services: [{desiredCount: 1, runningCount: 1, pendingCount: 0}]
    });
  });

  AWS.mock('ECS', 'updateService', updateServiceMock);
  AWS.mock('ECS', 'describeServices', describeServicesMock);

  await start();

  expect(updateServiceMock).toBeCalled();
});

it('should invoke describeServices if service has pending tasks', async() => {
  const updateServiceMock = jest.fn((params, cb) => {
    return cb(null, {desiredCount: 1, runningCount: 0, pendingCount: 1});
  });
  const describeServicesMock = jest.fn((params, cb) => {
    return cb(null, {
      services: [{desiredCount: 1, runningCount: 1, pendingCount: 0}]
    });
  });

  AWS.mock('ECS', 'updateService', updateServiceMock);
  AWS.mock('ECS', 'describeServices', describeServicesMock);

  await start();

  expect(describeServicesMock).toBeCalled();
});

it('should invoke describeServices again if service has still pending tasks', async() => {
  const updateServiceMock = jest.fn((params, cb) => {
    return cb(null, {desiredCount: 1, runningCount: 0, pendingCount: 1});
  });
  const describeServicesMock = jest.fn()
    .mockImplementationOnce((params, cb) => {
      return cb(null, {
        services: [{desiredCount: 1, runningCount: 0, pendingCount: 1}]
      });
    })
    .mockImplementationOnce((params, cb) => {
      return cb(null, {
        services: [{desiredCount: 1, runningCount: 0, pendingCount: 1}]
      });
    })
    .mockImplementationOnce((params, cb) => {
      return cb(null, {
        services: [{desiredCount: 1, runningCount: 1, pendingCount: 0}]
      });
    });

  AWS.mock('ECS', 'updateService', updateServiceMock);
  AWS.mock('ECS', 'describeServices', describeServicesMock);

  await start();

  expect(describeServicesMock).toBeCalled();
});

it('should return 1', async() => {
  const updateServiceMock = jest.fn((params, cb) => {
    return cb(null, {desiredCount: 1, runningCount: 0, pendingCount: 1});
  });
  const describeServicesMock = jest.fn((params, cb) => {
    return cb(null, {
      services: [{desiredCount: 0, runningCount: 1, pendingCount: 0}]
    });
  });

  AWS.mock('ECS', 'updateService', updateServiceMock);
  AWS.mock('ECS', 'describeServices', describeServicesMock);

  expect(await start()).toBe(1);
});
