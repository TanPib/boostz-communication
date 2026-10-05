import { createRequire } from 'module';
const require = createRequire('/home/user/boostz-mobile/mobile/package.json');
const esbuild = require('esbuild');
const here = process.cwd();
const stubs = {
  name: 'stubs',
  setup(b) {
    b.onResolve({ filter: /\/HoloCard$/ }, () => ({ path: here + '/stubs/HoloCard.js' }));
    b.onResolve({ filter: /assets-registry\/registry/ }, () => ({ path: here + '/stubs/assets.js' }));
    b.onResolve({ filter: /context\/ThemeContext$/ }, () => ({ path: here + '/stubs/ThemeContext.js' }));
  }
};
await esbuild.build({
  entryPoints: ['reel.jsx'], bundle: true, outfile: 'reel.js', minify: true, logLevel: 'error',
  loader: { '.js': 'jsx' }, jsx: 'automatic', plugins: [stubs],
  nodePaths: ['/home/user/boostz-mobile/mobile/node_modules'],
  alias: { 'react-native': 'react-native-web' },
  resolveExtensions: ['.web.js', '.js', '.jsx', '.json'], mainFields: ['browser', 'module', 'main'],
  define: { __DEV__: 'false', 'process.env.NODE_ENV': '"production"', global: 'window' }
});
console.log('built');
