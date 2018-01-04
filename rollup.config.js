import commonjs from 'rollup-plugin-commonjs';
import async from 'rollup-plugin-async';
import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'appendHtml'
    },
    plugins: [
      commonjs(),
      async()
    ]
  },
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
];
