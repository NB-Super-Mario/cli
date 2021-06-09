export const babelOpts = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { browsers: ['last 2 versions'] },
        loose: false,
        modules: 'commonjs',
        exclude: [
          'transform-typeof-symbol',
          'transform-unicode-regex',
          'transform-sticky-regex',
          'transform-new-target',
          'transform-modules-umd',
          'transform-modules-systemjs',
          'transform-modules-amd',
          'transform-literals',
        ],
      },
    ],
    require.resolve('@babel/preset-react'),
  ],
  plugins: [
    require.resolve('babel-plugin-react-require'),
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    [
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      { loose: false, useBuiltIns: false },
    ],
    require.resolve('@babel/plugin-proposal-optional-catch-binding'),
    require.resolve('@babel/plugin-proposal-async-generator-functions'),

    // 下面两个的顺序的配置都不能动
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      { loose: true },
    ],

    require.resolve('@babel/plugin-proposal-export-namespace-from'),
    require.resolve('@babel/plugin-proposal-export-default-from'),
    [
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      { loose: false },
    ],
    [
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      { loose: false },
    ],
    [
      require.resolve('@babel/plugin-proposal-pipeline-operator'),
      {
        proposal: 'minimal',
      },
    ],
    require.resolve('@babel/plugin-proposal-do-expressions'),
    require.resolve('@babel/plugin-proposal-function-bind'),
    require.resolve('babel-plugin-macros'),
    [
      require.resolve('@babel/plugin-transform-destructuring'),
      { loose: false },
    ],
    [
      require.resolve('babel-plugin-import'),

      {
        style: true,
        libraryDirectory: 'es', // 不加入会出现React.createElement: type is invalid
        libraryName: 'antd-mobile',
      },
      'antd-mobile',
    ],
    [
      require.resolve('babel-plugin-import'),
      {
        style: true,
        libraryDirectory: 'es', // 不加入会出现React.createElement: type is invalid
        libraryName: 'antd',
      },
      'antd',
    ],
    require.resolve('react-hot-loader/babel'),
  ],
};
