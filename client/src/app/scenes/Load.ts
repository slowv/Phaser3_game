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
    this.load.atlas(
      'cung_thu',
      CST.ATLAS.CHARACTER.CUNG_THU.PNG,
      CST.ATLAS.CHARACTER.CUNG_THU.JSON
    );
    this.load.image(CST.ATLAS.CHARACTER.CUNG_THU.AVATAR, CST.ATLAS.CHARACTER.CUNG_THU.AVATAR);
    this.load.animation(CST.ATLAS.CHARACTER.CUNG_THU.KEY, `${CST.ATLAS.CHARACTER.CUNG_THU.ANIMATION}`);
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

    // LOADING BAR
    const loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff
      },
    });
    this.load.on('progress', (percent: number) => {
      loadingBar.fillRect(20, this.game.renderer.height / 2, (this.game.renderer.width - 40) * percent, 20);
    });

    this.load.on('complete', () => {
      console.log('complete');
      // this.scene.start(CST.SCENES.MENU);
    });

    this.load.on('load', (file: Phaser.Loader.File) => {
      console.log(file.src);
    });
  }

  create(): void {
    this.scene.start(CST.SCENES.PLAY, this.player);
  }
}
