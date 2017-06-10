import lib from '.';

it('should export 4 functions', () => {
  expect(Object.keys(lib)).toHaveLength(4);
});
