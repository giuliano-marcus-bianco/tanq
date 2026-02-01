/**
 * Metro configuration for React Native
 * https://metrobundler.dev/docs/configuration
 *
 * Configuração SIMPLIFICADA para resolver problemas de resolução de módulos
 */

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch a pasta libs do monorepo
config.watchFolders = [
  path.resolve(monorepoRoot, 'libs'),
];

// 2. Resolver módulos do projeto mobile primeiro
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. NÃO usar alias para @tanq/core-logic - usamos deep imports diretamente

// 4. Bloquear react/react-dom do root para evitar conflitos de versão
config.resolver.blockList = [
  new RegExp(`^${escapeRegex(path.resolve(monorepoRoot, 'node_modules', 'react'))}(/.*)?$`),
  new RegExp(`^${escapeRegex(path.resolve(monorepoRoot, 'node_modules', 'react-dom'))}(/.*)?$`),
];

// Helper para escapar regex
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = config;
