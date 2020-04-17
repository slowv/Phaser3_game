import {CST} from '../util/CST';
import {Player} from '../entity/Player';
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import firebase from 'firebase/app';
import 'firebase/database';
import {Input} from '../jsx/roomList/Input';
import {ButtonRoomList} from '../jsx/roomList/ButtonRoomList';
import {log} from 'util';

export class RoomList extends Phaser.Scene {
  player: Player;
  cursor: Phaser.Input.InputPlugin;
  particles: ParticleEmitterManager;
  emitter: ParticleEmitter;
  mouse !: Phaser.Input.Pointer;
  db: firebase.database.Database;
  hudGroupLeft: Phaser.GameObjects.Group;
  hudGroupRight: Phaser.GameObjects.Group;
  txtLevel: Phaser.GameObjects.Text;
  txtPlayName: Phaser.GameObjects.Text;
  avatarCircle: Phaser.GameObjects.Image;
  avatarUI: Phaser.GameObjects.Image;

  constructor() {
    super({
      key: CST.SCENES.ROOM_WAIT
    });
  }

  init(player: Player) {
    this.player = player;
    this.player.photoURL = 'https://scontent-hkg4-1.xx.fbcdn.net/v/t31.0-8/s960x960/13483381_501764040019059_8369060431906599477_o.jpg?_nc_cat=100&_nc_sid=e007fa&_nc_ohc=wdzgTLYMqW4AX8MxB4f&_nc_ht=scontent-hkg4-1.xx&_nc_tp=7&oh=ee3de1e0e608281f33bda17210683140&oe=5EBA5499';
    this.db = firebase.database();
  }

  preload(): void {
    this.load.image('avatar', this.player.photoURL);
  }

  create() {
    this.cursor = this.input.setDefaultCursor('url(./assets/images/cursor/cursor_06.png), pointer');
    this.mouse = this.input.mousePointer;
    this.particles = this.add.particles('cursors_light').setDepth(100000);
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
      active: false
    });
    this.input.on('pointermove', () => {
      this.emitter.active = true;
      this.emitter.setPosition(this.mouse.x, this.mouse.y);
    });
    this.checkFirstTimeSignIn();
    this.cameras.main.fadeIn(1500);
    const bg1 = this.add.image(0, 0, 'bgRoomWait_1');
    bg1.setOrigin(0).setDisplaySize(1024, 576).setAlpha(.7);
    const bg2 = this.add.image(0, 0, 'bgRoomWait_2');
    bg2.setOrigin(0).setDisplaySize(1024, 576).setAlpha(0).setActive(false);
    this.time.addEvent({
      delay: 10 * 1000,
      callback: () => {
        if (bg1.alpha > 0) {
          this.add.tween({
            targets: bg1,
            alpha: {from: .7, to: 0},
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,            // -1: infinity
            yoyo: false
          });
          bg1.setActive(false);
          bg2.setActive(true);
          this.add.tween({
            targets: bg2,
            alpha: {from: 0, to: .7},
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,            // -1: infinity
            yoyo: false
          });
        } else {
          this.add.tween({
            targets: bg2,
            alpha: {from: .7, to: 0},
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 500,
            repeat: 0,            // -1: infinity
            yoyo: false
          });
          bg2.setActive(false);
          bg1.setActive(true);
          this.add.tween({
            targets: bg1,
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
  }

  createUI() {
    const sefl = this;
    // group left
    this.hudGroupLeft = this.add.group();
    this.hudGroupRight = this.add.group();
    const panelRooms = this.add.image(40, 40, 'roomlist');
    panelRooms.setOrigin(0).setAlpha(0).setX(-panelRooms.width + 40);
    this.hudGroupLeft.add(panelRooms);
    // group right
    const panelUserInfo = this.add.image(this.cameras.main.width - 40, 45, CST.HUD.BG_RL_AVATAR_UI);
    panelUserInfo.setDisplaySize(panelUserInfo.width * 1.6, panelUserInfo.height + 200)
      .setOrigin(0).setAlpha(.7).setAlpha(0);

    this.avatarUI = this.add.image(panelUserInfo.x + 15, panelUserInfo.y + 15, CST.HUD.AVATAR_UI);
    this.avatarUI.setDisplaySize(this.avatarUI.width / 2, this.avatarUI.height / 2)
      .setOrigin(0).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0).setDepth(2);
    panelUserInfo.originX = this.cameras.main.width - panelUserInfo.displayWidth - 40;
    this.avatarUI.originX = panelUserInfo.originX + 15;
    this.avatarUI.originY = panelUserInfo.y + 15;
    this.avatarCircle = this.add.image(this.cameras.main.width, this.avatarUI.originY + 15, 'avatar')
      .setOrigin(0)
      .setDisplaySize(this.avatarUI.displayWidth - 30, this.avatarUI.displayHeight - 30);
    this.avatarCircle.originX = this.avatarUI.originX + 10;
    this.avatarCircle.originY = this.avatarUI.originY + 15;
    console.log(sefl.player.email);
    this.txtPlayName = this.make.text({
      x: this.cameras.main.width,
      y: this.avatarCircle.originY,
      style: {
        font: '15px monospace',
        fill: '#ffffff'
      },
      text: sefl.player.userPlayName
    });
    this.txtPlayName.originX = this.avatarUI.originX + this.avatarUI.displayWidth + 10;
    this.txtLevel = this.make.text({
      x: this.cameras.main.width,
      y: this.txtPlayName.y + 30,
      style: {
        font: '12px monospace',
        fill: '#d2d2d2'
      },
      text: 'Level ' + sefl.player.level
    });
    this.txtLevel.setBlendMode(Phaser.BlendModes.ADD);
    this.txtLevel.originX = this.txtPlayName.originX;
    this.hudGroupRight.addMultiple([panelUserInfo, this.avatarUI, this.avatarCircle, this.txtPlayName, this.txtLevel]);
    sefl.fadeUI('IN');
  }

  fadeUI(key: string) {
    if (key === 'IN') {
      this.hudGroupLeft.getChildren().forEach((child: Phaser.GameObjects.Image | Phaser.GameObjects.Text) => {
        this.add.tween({
          targets: child,
          x: child.x + child.width,
          y: child.y,
          alpha: {from: 0, to: 1},
          ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 500,
          repeat: 0,            // -1: infinity
          yoyo: false
        });
      });

      this.hudGroupRight.getChildren().forEach((child: Phaser.GameObjects.Image | Phaser.GameObjects.Text) => {
        this.add.tween({
          targets: child,
          x: child.originX,
          y: child.y,
          alpha: {from: 0, to: 1},
          ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 500,
          repeat: 0,            // -1: infinity
          yoyo: false
        });
      });
    }
    if (key === 'OUT') {
      this.hudGroupLeft.getChildren().forEach((child: Phaser.GameObjects.Image | Phaser.GameObjects.Text) => {
        this.add.tween({
          targets: child,
          x: -(child.x + child.width),
          y: child.y,
          alpha: {from: 1, to: 0},
          ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 500,
          repeat: 0,            // -1: infinity
          yoyo: false
        });
      });
    }
  }

  checkFirstTimeSignIn() {
    const userInfoRef = this.db.ref('users/' + this.player.id);
    const sefl = this;
    userInfoRef.once('value').then((snapshot) => {
      if (null == snapshot.val()) {
        sefl.showPopupSetPlayName();
      } else {
        sefl.player = snapshot.val();
        console.log(sefl.player);
        sefl.createUI();
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  showPopupSetPlayName() {
    const sefl = this;
    const x = 200;
    const y = 100;
    const groupSetNewPlayName = this.add.group();
    const rect = this.add.rectangle(x, y, this.cameras.main.width - 400,
      this.cameras.main.height - 350, 0xffffff, 1);
    rect.setOrigin(0);
    const text = this.make.text({
      x: rect.x + 50,
      y: rect.y + 30,
      text: 'CHÀO MỪNG BẠN ĐẾN VỚI "SlowV" \n\n Lần đầu bạn vào game vui lòng đặt tên nhân vật.',
      style: {
        font: '20px monospace',
        align: 'center',
        fill: '#DC4E41',
      }
    });
    // @ts-ignore
    const inputJSX = this.add.dom(text.x, text.y + text.height + 50, Input).setOrigin(0);
    // @ts-ignore
    const btnJSX = this.add.dom(inputJSX.x + inputJSX.width + 30, inputJSX.y, ButtonRoomList).setOrigin(0);
    groupSetNewPlayName.addMultiple([rect, inputJSX, btnJSX, text]);
    const input = document.getElementById('input-re-play-name');
    const button = document.getElementById('btn-save-player-name');
    input.addEventListener('keyup', () => {
      // @ts-ignore
      if (input.value !== '' || input.value.length > 0) {
        // @ts-ignore
        button.disabled = false;
        return;
      }
      // @ts-ignore
      button.disabled = true;
    });
    button.addEventListener('click', () => {
      // @ts-ignore
      if (!sefl.checkPlayName(input.value)) {
        // @ts-ignore
        this.player = this.player.getNewPlayer(this.player, input.value);
        sefl.setPlayName(this.player);
        groupSetNewPlayName.active = false;
        groupSetNewPlayName.setAlpha(0);
        groupSetNewPlayName.destroy(true);
      }
    });
  }

  setPlayName(player: Player) {
    const sefl = this;
    this.db.ref('users/' + this.player.id).set(player).then(() => {
      sefl.hudGroupLeft.active = true;
      sefl.hudGroupLeft.setAlpha(1);
    });
  }

  checkPlayName(namePlay: string) {
    this.db.ref('users')
      .orderByChild('userPlayName').equalTo(namePlay).once('value', (snapshot) => {
      if (snapshot.exists()) {
        return true;
      }
    });
    return false;
  }

  update(time: number, delta: number): void {
  }
}
