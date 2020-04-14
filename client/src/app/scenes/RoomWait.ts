import {CST} from '../util/CST';
import {SingleRoom} from 'phaser3-rex-plugins/plugins/firebase-components.js';
import {Player} from '../entity/Player';
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import firebase from 'firebase/app';
import 'firebase/database';
const COLOR_PRIMARY = 0x4e342e;

export class RoomWait extends Phaser.Scene {
  [x: string]: any;

  room: SingleRoom;
  player: Player;
  cursor: Phaser.Input.InputPlugin;
  particles: ParticleEmitterManager;
  emitter: ParticleEmitter;
  mouse !: Phaser.Input.Pointer;
  db: firebase.database.Database;
  hudGroup: Phaser.GameObjects.Group;
  constructor() {
    super({
      key: CST.SCENES.ROOM_WAIT
    });
  }

  init(player: Player) {
    this.player = player;
    console.log(this.player);
    this.db = firebase.database();
  }

  create() {
    this.checkFirstTimeSignIn();
    this.cameras.main.fadeIn(1500);
    const bg_1 = this.add.image(0, 0, 'bgRoomWait_1');
    bg_1.setOrigin(0).setDisplaySize(1024, 576).setAlpha(.7);
    const bg_2 = this.add.image(0, 0, 'bgRoomWait_2');
    bg_2.setOrigin(0).setDisplaySize(1024, 576).setAlpha(0).setActive(false);
    this.time.addEvent({
      delay: 10 * 1000,
      callback: () => {
        if (bg_1.alpha > 0) {
          this.add.tween({
            targets: bg_1,
            alpha: {from: .7, to: 0},
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,            // -1: infinity
            yoyo: false
          });
          bg_1.setActive(false);
          bg_2.setActive(true);
          this.add.tween({
            targets: bg_2,
            alpha: {from: 0, to: .7},
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,            // -1: infinity
            yoyo: false
          });
        } else {
          this.add.tween({
            targets: bg_2,
            alpha: {from: .7, to: 0},
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 500,
            repeat: 0,            // -1: infinity
            yoyo: false
          });
          bg_2.setActive(false);
          bg_1.setActive(true);
          this.add.tween({
            targets: bg_1,
            alpha: {from: 0, to: .7},
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 500,
            repeat: 0,            // -1: infinity
            yoyo: false
          });
        }
      },
      callbackScope: this,
      loop: true
    });
    this.createUI();
  }

  createUI() {
    this.cursor = this.input.setDefaultCursor('url(./assets/images/cursor/cursor_06.png), pointer');
    this.mouse = this.input.mousePointer;
    this.particles = this.add.particles('cursors_light');
    this.emitter = this.particles.createEmitter({
      x: 0,
      y: 576,
      blendMode: Phaser.BlendModes.ADD,
      alpha: .5,
      speed: {min: 30, max: 50},
      angle: 45,
      gravityY: 200,
      quantity: 1,
      scale: {start: 0.1, end: 0},
      active: false,
    });
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.emitter.active = true;
    });
    this.hudGroup = this.add.group();
    const panelRooms = this.add.image(40, 40, 'roomlist');
    panelRooms.setOrigin(0);
    this.hudGroup.add(panelRooms);
  }

  checkFirstTimeSignIn() {
    const userInfoRef = this.db.ref('users/' + 333);
    const sefl = this;
    userInfoRef.once('value').then((snapshot) => {
      if (null == snapshot.val()) {
        // userInfoRef.set(this.player).then((ref) => {
        //   console.log(ref);
        // });
        sefl.hudGroup.active = false;
        sefl.hudGroup.setAlpha(0);
        this.add.tween({
          targets: sefl.hudGroup,
          alpha: {from: 1, to: 0},
          ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 500,
          repeat: 0,            // -1: infinity
          yoyo: false
        });
      } else {
        console.log(snapshot.val());
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  update(time: number, delta: number): void {
    if (this.emitter.active) {
      this.emitter.setPosition(this.mouse.x + 13.5, this.mouse.y + 8);
    }
  }
}
