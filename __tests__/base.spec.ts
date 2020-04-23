import { resolve } from 'path';
import { dynamicImport } from '../src/utils/dynamic-import';

test('test dynamicImport', async () => {
  const pkg = await dynamicImport(resolve(__dirname, '../', 'package.json'));
  expect(pkg.name).toEqual('@nbsupermario/cli');
});
