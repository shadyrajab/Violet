import 'reflect-metadata';

import { ShardingManager } from 'discord.js';
import { DISCORD_TOKEN } from './core/constants';

const manager = new ShardingManager('./dist/infrastructure/client.js', {
  token: DISCORD_TOKEN,
});

manager.on('shardCreate', (shard) => console.log(`Launched shard ${shard.id}`));

manager.spawn();
