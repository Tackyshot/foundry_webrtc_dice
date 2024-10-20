import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import node_externals from 'rollup-plugin-node-externals';
import { glob } from 'glob';

export default {
  input: 'src/scripts/idx.mjs',
  output: {
    dir: 'dist/scripts',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    node_externals(),
    resolve({ browser: true }),
    commonjs(),
    copy({
      targets: [
        { src: 'src/**/*', dest: 'dist' },
        { src: ['module.json', 'README.md', 'CHANGELOG.md', 'LICENSE'], dest: 'dist' }
      ],
      // Preserve the directory structure
      flatten: false,
      // Don't copy .mjs files as they will be handled by rollup
      ignore: ['**/*.mjs'],
    }),
  ],
};