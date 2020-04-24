import {CST} from '../util/CST';
import {Player} from '../entity/Player';
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import firebase from 'firebase/app';
import 'firebase/database';
import {Input} from '../jsx/roomList/Input';
import {ButtonRoomList} from '../jsx/roomList/ButtonRoomList';
import { SingleRoom } from 'phaser3-rex-plugins/plugins/firebase-components.js';

export class RoomList extends Phaser.Scene {
  player: Player;
  cursor: Phaser.Input.InputPlugin;
  particles: ParticleEmitterManager;
  emitter: ParticleEmitter;
  mouse !: Phaser.Input.Pointer;
  db: firebase.database.Database;
  hudGroupLeft: Phaser.GameObjects.Group;
  hudGroupRight: Phaser.GameObjects.Group;
  txtLevelAndRank: Phaser.GameObjects.Text;
  txtPlayName: Phaser.GameObjects.Text;
  avatarCircle: Phaser.GameObjects.Image;
  avatarUI: Phaser.GameObjects.Image;
  groupDialogCreateRoom: Phaser.GameObjects.Group;

  constructor() {
    super({
      key: CST.SCENES.ROOM_WAIT
    });
  }

  init(player: Player) {
    this.player = player;
    this.player.photoURL = 'https://scontent-hkg4-1.xx.fbcdn.net/v/t31.0-8/s960x960/13483381_501764040019059_8369060431906599477_o.jpg?' +
      '_nc_cat=100&_nc_sid=e007fa&_nc_ohc=wdzgTLYMqW4AX8MxB4f&' +
      '_nc_ht=scontent-hkg4-1.xx&_nc_tp=7&oh=ee3de1e0e608281f33bda17210683140&oe=5EBA5499';
    this.db = firebase.database();
  }

  preload(): void {
    this.load.image('avatar', this.player.photoURL);
    let url;
    url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js';
    this.load.plugin('rexbbcodetextplugin', url, true);
    url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js';
    this.load.plugin('rextexteditplugin', url, true);
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
    bg1.setOrigin(0).setDisplaySize(1024, 576).setAlpha(.7).setFlipX(true);
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
    panelUserInfo.setDisplaySize(panelUserInfo.width * 1.6, panelUserInfo.height)
      .setOrigin(0);
    this.avatarUI = this.add.image(panelUserInfo.x + 15, panelUserInfo.y + 15, CST.HUD.AVATAR_UI2);
    this.avatarUI.setOrigin(0).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0).setDepth(2);
    panelUserInfo.originX = this.cameras.main.width - panelUserInfo.displayWidth - 40;
    this.avatarUI.originX = panelUserInfo.originX + 15;
    this.avatarUI.originY = panelUserInfo.y + 15;
    this.avatarCircle = this.add.image(this.cameras.main.width, this.avatarUI.originY, 'avatar')
      .setOrigin(0)
      .setDisplaySize(this.avatarUI.displayWidth, this.avatarUI.displayHeight);
    this.avatarCircle.originX = this.avatarUI.originX;
    this.avatarCircle.originY = this.avatarUI.originY;
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
    this.txtLevelAndRank = this.make.text({
      x: this.cameras.main.width,
      y: this.txtPlayName.y + 30,
      style: {
        font: '12px monospace',
        fill: '#d2d2d2'
      },
      text: `Level: ${sefl.player.level}\n\nRank:    ${sefl.player.rank.name} ${sefl.player.rank.levelRoman} (${sefl.player.rank.score} DNG)`
    });
    this.txtLevelAndRank.setBlendMode(Phaser.BlendModes.ADD);
    this.txtLevelAndRank.originX = this.txtPlayName.originX;
    const rankIcon = this.add.sprite(this.cameras.main.width, this.txtLevelAndRank.y + 32, CST.SPRITE.RANK, this.player.rank.frame);
    rankIcon.setDisplaySize(rankIcon.width / 2, rankIcon.height / 2);
    rankIcon.originX = this.txtLevelAndRank.originX + 45;
    const trackBarEXP = this.add.image(
      this.cameras.main.width,
      45 + panelUserInfo.displayHeight - 25,
      CST.HUD.TRACK_BAR_EXP
    );
    const txtExp = this.make.text({
      x: this.cameras.main.width,
      y: trackBarEXP.y,
      style: {
        font: '12px monospace',
        fill: '#d2d2d2'
      },
      text: `Exp:  ${this.player.exp}/${this.player.expNextLevel}`
    });
    txtExp.setBlendMode(Phaser.BlendModes.ADD);
    trackBarEXP.setOrigin(0).setDisplaySize(panelUserInfo.displayWidth - this.avatarUI.width, trackBarEXP.height);
    const barEXP = this.add.image(this.cameras.main.width, trackBarEXP.y, CST.HUD.BAR_EXP).setOrigin(0);
    barEXP.setDisplaySize(this.calcWidthBarEXP(trackBarEXP.displayWidth, this.player.exp, this.player.expNextLevel),
      trackBarEXP.displayHeight);
    barEXP.setTintFill(0xC79518);
    txtExp.originX = panelUserInfo.originX + 15;
    trackBarEXP.originX = panelUserInfo.originX + 50;
    barEXP.originX = trackBarEXP.originX;
    txtExp.setDepth(2);

    const panelHistoryChampion = this.add.image(this.cameras.main.width - 40,
      panelUserInfo.y + panelUserInfo.height + 20, CST.HUD.BG_HISTORY_CHAM);
    panelHistoryChampion.setOrigin(0).setDisplaySize(panelUserInfo.displayWidth, panelHistoryChampion.height);
    panelHistoryChampion.originX = panelUserInfo.originX;
    const txtHistory = this.make.text({
      x: this.cameras.main.width,
      y: panelHistoryChampion.y + 15,
      style: {
        font: '12px monospace',
        fill: '#ffffff'
      },
      text: 'LỊCH SỬ ĐẤU'
    });
    txtHistory.originX = panelHistoryChampion.originX + 15;
    const btnCreateRoom = this.add.rectangle(this.cameras.main.width, panelHistoryChampion.y + panelHistoryChampion.height + 30,
      panelHistoryChampion.displayWidth / 2, 30, 0x272525);
    btnCreateRoom.setStrokeStyle(2, 0xD6B221, .7).setOrigin(0);
    btnCreateRoom.originX = panelHistoryChampion.originX;
    btnCreateRoom.setInteractive({cursor: 'url(assets/images/cursor/cursor_03.png), pointer'});
    btnCreateRoom.on('pointerdown', () => {
      this.showDialogCreateRoom();
    });
    btnCreateRoom.on('pointermove', () => {
      btnCreateRoom.setBlendMode(Phaser.BlendModes.ADD);
    });
    btnCreateRoom.on('pointerout', () => {
      btnCreateRoom.setBlendMode(Phaser.BlendModes.NORMAL);
    });
    const txtCreateRoom = this.make.text({
      x: this.cameras.main.width,
      y: btnCreateRoom.y + 8,
      style: {
        font: '14px monospace',
        fill: '#ffffff',
        align: 'center',
        lineSpacing: 1,
      },
      text: 'TẠO PHÒNG'
    });
    txtCreateRoom.setOrigin(0);
    txtCreateRoom.originX = btnCreateRoom.originX + 40;
    this.hudGroupRight.addMultiple(
      [
        panelUserInfo, this.avatarUI, this.avatarCircle, this.txtPlayName, this.txtLevelAndRank,
        rankIcon, txtExp, trackBarEXP, barEXP,
        panelHistoryChampion, txtHistory, btnCreateRoom, txtCreateRoom
      ]
    );
    // sefl.showDialogCreateRoom();
    sefl.fadeUI('IN');
  }

  calcWidthBarEXP(wTrack, wExp, wTotalExp) {
    const percentExp = wTotalExp / (wTotalExp + wExp) * 100;
    return wTrack - (wTrack * (percentExp / 100));
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
          alpha: {from: 1, to: 0},
          ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 500,
          repeat: 0,            // -1: infinity
          yoyo: false
        });
      });
      this.hudGroupRight.getChildren().forEach((child: Phaser.GameObjects.Image | Phaser.GameObjects.Text) => {
        this.add.tween({
          targets: child,
          x: child.x,
          alpha: {from: 1, to: 0},
          ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 500,
          repeat: 0,            // -1: infinity
          yoyo: false
        });
      });
    }
  }

  showDialogCreateRoom() {
    const self = this;
    self.hudGroupLeft.setAlpha(.3);
    self.hudGroupRight.setAlpha(.3);
    this.groupDialogCreateRoom = this.add.group();
    const rectBgDialogCreateRoom = this.add.rectangle(300, 100, this.cameras.main.width - 600, 200, 0xffffff);
    rectBgDialogCreateRoom.setOrigin(0);
    const txtCreateRoom = this.make.text({
      x: rectBgDialogCreateRoom.x + 10,
      y: rectBgDialogCreateRoom.y + 10,
      style: {
        font: '16px monospace',
        fill: '#424242',
        align: 'center'
      },
      text: 'TẠO PHÒNG'
    });
    const txtRoomName = this.make.text({
      x: 315,
      y: 150,
      style: {
        font: '14px monospace',
        fill: '#424242',
        align: 'center'
      },
      text: 'Tên phòng'
    });
    // @ts-ignore
    let inputRoomName = this.add.rexBBCodeText(315, 170, '', {
      color: '#734E08',
      fontSize: '15px',
      fixedWidth: 250,
      fixedHeight: 40,
      backgroundColor: '#272525',
      valign: 'center',
      strokeThickness: 1,
      padding: {
        left: 5,
        right: 5,
        top: 0,
        bottom: 0,
      },
    }).setOrigin(0)
      .setInteractive()
      .on('pointerdown', () => {
        // @ts-ignore
        self.plugins.get('rextexteditplugin').edit(inputRoomName);
      }, this);
    const txtRoomMaxPlayer = this.make.text({
      x: 580,
      y: 150,
      style: {
        font: '14px monospace',
        fill: '#424242',
        align: 'center'
      },
      text: 'Số người chơi'
    });
    // @ts-ignore
    let inputRoomMaxPlayer = this.add.rexBBCodeText(580, 170, '', {
      color: '#734E08',
      fontSize: '15px',
      fixedWidth: 130,
      fixedHeight: 40,
      backgroundColor: '#272525',
      valign: 'center',
      strokeThickness: 1,
      padding: {
        left: 5,
        right: 5,
        top: 0,
        bottom: 0,
      },
    }).setOrigin(0)
      .setInteractive()
      .on('pointerdown', () => {
        // @ts-ignore
        self.plugins.get('rextexteditplugin').edit(inputRoomMaxPlayer);
      }, this);
    const btnCreateRoom = this.add.rectangle(rectBgDialogCreateRoom.x + rectBgDialogCreateRoom.width - 115,
      rectBgDialogCreateRoom.y + rectBgDialogCreateRoom.height - 40, 100, 30, 0x272525);
    btnCreateRoom.setStrokeStyle(2, 0xD6B221, .7).setOrigin(0);
    btnCreateRoom.setInteractive()
      .on('pointermove', () => {
        btnCreateRoom.setFillStyle(0xF68F10);
      })
      .on('pointerout', () => {
        btnCreateRoom.setFillStyle(0x272525);
      })
      .on('pointerdown', () => {
        self.createRoom(inputRoomName.text);
      });
    const btnCancel = this.add.rectangle(btnCreateRoom.x - 115, btnCreateRoom.y, 100, 30, 0x272525);
    btnCancel.setInteractive().setStrokeStyle(2, 0xD6B221, .7).setOrigin(0)
      .on('pointermove', () => {
        btnCancel.setFillStyle(0xDD5145);
      })
      .on('pointerout', () => {
        btnCancel.setFillStyle(0x272525);
      })
      .on('pointerdown', () => {
        self.groupDialogCreateRoom.destroy(true);
        self.hudGroupLeft.setAlpha(1);
        self.hudGroupRight.setAlpha(1);
      });
    const txtCreate = this.make.text({
      x: btnCreateRoom.x + 20,
      y: btnCreateRoom.y + 8,
      text: 'TẠO PHÒNG',
      style: {
        font: '12px monospace',
        fill: '#f4f4f4',
        align: 'center'
      }
    });
    const txtCancel = this.make.text({
      x: btnCancel.x + 40,
      y: btnCancel.y + 8,
      text: 'HỦY',
      style: {
        font: '12px monospace',
        fill: '#f4f4f4',
        align: 'center'
      }
    });
    this.groupDialogCreateRoom.addMultiple(
      [
        rectBgDialogCreateRoom, txtCreateRoom, inputRoomName, txtRoomName, inputRoomMaxPlayer,
        txtRoomMaxPlayer, btnCreateRoom, txtCreate, btnCancel, txtCancel,
      ]
    );
  }
  createRoom(name: string) {
    var room = new SingleRoom({
      root: name,
      broadcast: true,
    });
    room.setUser(this.player.id, this.player.userPlayName);
    room.joinRoom();
    console.log(room);
  }

  checkFirstTimeSignIn() {
    const userInfoRef = this.db.ref('users/' + this.player.id);
    const sefl = this;
    userInfoRef.once('value').then((snapshot) => {
      if (null == snapshot.val()) {
        sefl.showPopupSetPlayName();
      } else {
        sefl.player = snapshot.val();
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
        sefl.createUI();
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
    this.db.ref('users').once('value', (snapshot) => {
      snapshot.val().forEach((value: Player) => {
        if (value.userPlayName === namePlay) {
          return true;
        }
      });
    });
    return false;
  }

  update(time: number, delta: number): void {
  }
}
