/**
 * 动态import for script
 * var x = 'someplace';
 * import(x).then((a) => {
 * // `a` is imported and can be used here
 * });
 * or
 * async function run(x) {
 * const a = await import(x);
 * // `a` is imported and can be used here
 * }
 * @param pathName
 * @author ly.boy2012@gmai.com
 */

export const dynamicImport = async (
  pathName: string
): Promise<{ [key: string]: any }> => {
  const mod = await import(pathName);
  return mod;
};

/* const pkg = await dynamicImport(resolve(__dirname, '../', 'package.json'));
  console.log(`${__dirname}-------${JSON.stringify(pkg)}`);
  console.log(pkg.version); */
