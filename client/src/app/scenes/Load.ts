import {CST} from '../util/CST';
import {Player} from '../entity/Player';

export class Load extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.LOAD
    });
  }

  player: Player;

  init(player: Player) {
    this.player = player;
  }

  loadImages(): void {
    this.load.setPath('assets/images');
    // tslint:disable-next-line:forin
    for (const prop in CST.IMAGE) {
      this.load.image(CST.IMAGE[prop], CST.IMAGE[prop]);
    }
  }


  loadAudio() {
    this.load.setPath('assets/sound');
    // tslint:disable-next-line:forin
    for (const prop in CST.AUDIO) {
      this.load.audio(CST.AUDIO[prop], CST.AUDIO[prop]);
    }
  }

  loadSprites(frameConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig): void {
    this.load.setPath('assets/sprite');
    // tslint:disable-next-line:forin
    for (const prop in CST.SPRITE) {
      this.load.spritesheet(CST.SPRITE[prop], CST.SPRITE[prop], frameConfig);
    }
  }

  loadAtlas() {
    this.load.setPath('assets/images');
    this.load.image(CST.ATLAS.CHARACTER.RIVEN.AVATAR, CST.ATLAS.CHARACTER.RIVEN.AVATAR);
  }

  loadTilemap(): void {
    this.load.setPath('assets/tileset');
    this.load.image('terrain', CST.TILEMAP.PNG);
    this.load.tilemapTiledJSON('mappy', CST.TILEMAP.JSON);
  }

  loadHUD(): void {
    this.load.setPath('assets/hud');
    // tslint:disable-next-line:forin
    for (const prop in CST.HUD) {
      this.load.image(CST.HUD[prop], CST.HUD[prop]);
    }
  }

  preload(): void {
    // LOAD ASSETS
    this.loadImages();
    this.loadAudio();
    this.loadSprites({
      frameWidth: 250,
      frameHeight: 396
    });
    this.loadAtlas();
    this.loadTilemap();
    this.loadHUD();

    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height).setOrigin(0)
      .setStrokeStyle(4, 0x515151, 1);

    // LOADING BAR
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBar.setDepth(99);
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(250, 280, 1024 / 2, 30);
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 45,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#515151'
      }
    });
    loadingText.setOrigin(0.5, 0.5);
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 + 6,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5).setDepth(100);
    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 55,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#515151'
      }
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xDC4E41, 1);
      progressBar.fillRect(250, 280, (1024 / 2) * value, 30);
      percentText.setText(Math.ceil(value * 100).toString() + '%');
    });

    this.load.on('complete', () => {
      console.log('complete');
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      setTimeout(() => {
        this.scene.start(CST.SCENES.ROOM_WAIT, this.player);
      }, 1 * 1000);
    });

    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.setPath('./assets/images');
    this.load.image('logo', 'logo_dark.png');
    // particles mouse
    this.load.image('cursors_light', 'particles/cursor_light.png');
    // Asset phòng chờ
    // bg room wait
    this.load.image('bgRoomWait_1', 'bg_login2.jpg');
    this.load.image('bgRoomWait_2', 'bg_login3.jpg');
    this.load.image('roomlist', 'roomList.png');
  }

  create(): void {
    this.add.image(1024 / 2, 576 / 2, 'logo').setScale(.3);
  }
}
