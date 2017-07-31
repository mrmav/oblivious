"use strict";

const game = new Phaser.Game(Game.config);  // width, height, renderer, parent, state, transparent, antialias, physicsConfig

game.state.add('Game.Boot', Game.Boot);
game.state.add('Game.Preload', Game.Preload);
game.state.add('Game.Menu', Game.Menu);
game.state.add('Game.Credits', Game.Credits);
game.state.add('Game.HowTo', Game.HowTo);
game.state.add('Game.Play', Game.Play);

game.state.start('Game.Boot');