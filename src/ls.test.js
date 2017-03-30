import AWS from 'aws-sdk-mock';

import {ls} from './ls';

it('should export ls function', () => {
  expect(ls).toBeInstanceOf(Function);
});

it('should invoke listServices function', async() => {
  AWS.mock('ECS', 'listServices', []);
  const services = await ls();

  expect(services).toEqual([]);
});
