import {SingleRoom} from 'phaser3-rex-plugins/plugins/firebase-components.js';

export class Room {
  createRoom() {
    return new SingleRoom({
      root: 'rooms',
      broadcast: true
    });
  }
}
