import { deepSwap } from './deep-swap.js';
import { assertEquals } from './dev_deps.js';

const test = Deno.test;

test('swap key "id" for "_id"', () => {
  const game = { id: 'game-1', type: 'game', name: 'Super Mario Bros' };
  const newGame = deepSwap('id', '_id', game);
  assertEquals(newGame, {
    _id: 'game-1',
    type: 'game',
    name: 'Super Mario Bros',
  });
});

test('deep swap "id" for "_id"', () => {
  const selector = {
    $or: [
      { type: 'game', id: { $gt: 'game-1' } },
      { type: 'appearance', game_id: 'game-1' },
    ],
  };
  const answer = {
    $or: [
      { type: 'game', _id: { $gt: 'game-1' } },
      { type: 'appearance', game_id: 'game-1' },
    ],
  };
  const newSelector = deepSwap('id', '_id', selector);
  assertEquals(newSelector, answer);
});

test('deep swap using $in', () => {
  const selector = {
    type: {
      $in: ['game', 'character'],
    },
  };
  const answer = selector;

  const newSelector = deepSwap('id', '_id', selector);
  assertEquals(newSelector, answer);
});

test('deep swap using $in', () => {
  const selector = {
    type: {
      $in: [1, 2],
    },
  };
  const answer = selector;

  const newSelector = deepSwap('id', '_id', selector);
  assertEquals(newSelector, answer);
});
