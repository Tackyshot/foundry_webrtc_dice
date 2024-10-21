import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';

export default {
  input: 'src/scripts/idx.mjs',
  output: {
    dir: 'dist/scripts',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve({ 
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    json(),
    // typescript({ tsconfig: './tsconfig.json' }),
    terser(),
    copy({
      targets: [
        { src: 'src/**/*', dest: 'dist' },
        { src: ['module.json', 'README.md', 'CHANGELOG.md', 'LICENSE'], dest: 'dist' }
      ],
      flatten: false,
      ignore: ['**/*.mjs', '**/*.ts'],
    }),
  ],
  external: ['foundry'],
};
