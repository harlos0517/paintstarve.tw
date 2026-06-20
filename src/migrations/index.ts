import * as migration_20260620_182423 from './20260620_182423';
import * as migration_20260620_183807 from './20260620_183807';

export const migrations = [
  {
    up: migration_20260620_182423.up,
    down: migration_20260620_182423.down,
    name: '20260620_182423',
  },
  {
    up: migration_20260620_183807.up,
    down: migration_20260620_183807.down,
    name: '20260620_183807'
  },
];
