import {CST} from '../util/CST';
import {CharacterSprite} from '../entity/CharacterSprite';
import MoveTo from 'phaser3-rex-plugins/plugins/moveto.js';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class PlayGame extends Phaser.Scene {
  champion!: CharacterSprite;
  keys!: { [index: string]: Phaser.Input.Keyboard.Key };
  pointer!: Phaser.Input.Pointer;
  textFPS!: Phaser.GameObjects.Text;
  cursorKeys !: Phaser.Types.Input.Keyboard.CursorKeys;
  self !: PlayGame;
  cameraMain !: Phaser.Cameras.Scene2D.Camera;

  // textFPS!:
  constructor() {
    super({
      key: CST.SCENES.LEVEL_1
    });
  }

  init() {
    console.log('level 1');
  }

  preload(): void {

  }

  create(): void {
    this.self = this;
    this.champion = new CharacterSprite(this, 100, 100, 'cung_thu', 'character-20', CST.ATLAS.CHARACTER.CUNG_THU.KEY);
    // @ts-ignore
    window.champion = this.champion;
    this.self.cameras.main.startFollow(this.champion);
    this.self.champion.setCollideWorldBounds(true);
    // @ts-ignore
    this.self.keys = this.input.keyboard.addKeys('Q, W, E, R, F1');

    const moveTo = new MoveTo(this.self.champion, {
      speed: this.self.champion.speed
    });

    // Click to move
    this.self.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      moveTo.moveTo(pointer.x, pointer.y);
    });

    this.self.pointer = this.input.activePointer;
    this.self.textFPS = this.make.text({
      x: 10,
      y: 10,
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      text: '0 fps',
      style: {
        font: 'bold 15px Arial',
        color: '#ffffff',
        align: 'center',  // 'left'|'center'|'right'|'justify'
        backgroundColor: 'transparent'
      },
      add: true
    });
    this.self.cursorKeys = this.input.keyboard.createCursorKeys();
    this.self.cameraMain = this.cameras.main;
  }

  update(time: number, delta: number): void {
    this.self.textFPS.text = 'fps: ' + Math.ceil(this.game.loop.actualFps);
    this.self.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {

    });

    if (this.self.cursorKeys.up.isDown) {
      this.self.cameraMain.y += 10;
    } else if (this.self.cursorKeys.down.isDown) {
      this.self.cameraMain.y -= 10;
    }

    // Camera follow character
    if (this.self.keys.F1.isDown) {
      this.self.cameraMain.setPosition(this.self.champion.body.x, this.self.champion.body.y);
    }
  }
}
