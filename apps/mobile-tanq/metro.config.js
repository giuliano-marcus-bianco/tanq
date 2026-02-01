const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// Resolve modules from project root first, then monorepo root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Extra modules directories for core-logic library
config.resolver.extraNodeModules = {
  '@tanq/core-logic': path.resolve(monorepoRoot, 'libs/core-logic/src'),
};

// Add native extension resolution
config.resolver.sourceExts = ['native.tsx', 'native.ts', ...config.resolver.sourceExts];

module.exports = config;
