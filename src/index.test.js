import {ls} from './index';

it('should export ls function', () => {
  expect(ls).toBeInstanceOf(Function);
});
