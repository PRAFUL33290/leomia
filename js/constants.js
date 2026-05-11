'use strict';

const TS = 40; // tile size
const COLS = 20;
const ROWS = 15;
const CW = COLS * TS; // 800
const CH = ROWS * TS; // 600

const T = {
  FLOOR: 0,
  WALL: 1,
  DOOR: 2,
  TRAP: 4,
  INVIS: 7,
  BREAK: 14,
  PUSH: 15,
};

const GS = {
  MENU: 'menu',
  MODE: 'mode',
  PLAYING: 'playing',
  PAUSED: 'paused',
  LEVEL_DONE: 'level_done',
  GAME_OVER: 'game_over',
  WIN: 'win',
};

const IT = {
  KEY: 'key',
  FRAGMENT: 'fragment',
  CHECKPOINT: 'checkpoint',
  TORCH: 'torch',
  BOOTS: 'boots',
  COMPASS: 'compass',
  ORB: 'orb',
  CRYSTAL: 'crystal',
  SWITCH: 'switch',
};

const CLR = {
  WALL:    '#3a3a5c',
  WALL2:   '#5a5a8c',
  FLOOR:   '#c8b896',
  FLOOR2:  '#b8a886',
  TRAP:    '#c82020',
  DOOR:    '#8b5e3c',
  INVIS:   '#c8b896', // looks like floor
  BREAK:   '#6a4a3c',
  DARK:    '#111122',
  HUD:     '#1a1a3a',
  TEXT:    '#ffffff',
  LEO:     '#2266cc',
  MIA:     '#9933cc',
  ENEMY:   '#cc2222',
  KEY:     '#ffcc00',
  FRAG:    '#00ddff',
  CHECK:   '#00cc66',
  TORCH:   '#ff8800',
  SWITCH:  '#ff6600',
  CRYSTAL: '#88aaff',
};
