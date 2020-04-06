import {CST} from '../util/CST';
import {CharacterSprite} from '../entity/CharacterSprite';
import {ImageHud} from '../entity/ImageHud';
import {TextHUD} from '../entity/TextHUD';

export class PlayGame extends Phaser.Scene {
  champion!: CharacterSprite;
  keys!: { [index: string]: Phaser.Input.Keyboard.Key };
  pointer!: Phaser.Input.Pointer;
  textFPS!: Phaser.GameObjects.Text;
  cursorKeys !: Phaser.Types.Input.Keyboard.CursorKeys;
  self !: PlayGame;
  cameraMain !: Phaser.Cameras.Scene2D.Camera;
  controls!: Phaser.Cameras.Controls.SmoothedKeyControl;
  cameraBounds = {
    x: 0,
    y: 0,
    width: 1680,
    height: 1680
  };
  // HUD variable
  HUDStat: ImageHud;
  HUDAttack: ImageHud;
  HUDMagic: ImageHud;
  HUDArmor: ImageHud;
  HUDMagicResistance: ImageHud;
  HUDAttackSpeed: ImageHud;
  HUDReloadSkill: ImageHud;
  HUDAttackDistance: ImageHud;
  HUDCritical: ImageHud;
  HUDAvatarAndSkill: ImageHud;
  HUDItem: ImageHud;
  HUDMap: ImageHud;

  // TEXT FOR HUD
  txtHUDAttack: TextHUD;
  txtHUDMagic: TextHUD;
  txtHUDArmor: TextHUD;
  txtHUDMagicResistance: TextHUD;
  txtHUDAttackSpeed: TextHUD;
  txtHUDReloadSkill: TextHUD;
  txtHUDAttackDistance: TextHUD;
  txtHUDCritical: TextHUD;

  constructor() {
    super({
      key: CST.SCENES.PLAY
    });
  }

  init() {
    console.log('level 1');
  }

  preload(): void {

  }

  create(): void {
    this.self = this;
    this.makeChampionAndEvents();
    // MAP
    this.makeMap();
    // POINTER
    this.self.pointer = this.input.activePointer;
    // TEXT
    this.textFPS = new TextHUD(this, window.innerWidth - 120, 10, '0 fps', {
      fontStyle: 'bold',
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    });
    // CAM
    this.makeCAM();
    this.makeHUD();
  }

  // EVENT FUNCTION
  update(time: number, delta: number): void {
    this.self.textFPS.text = `FPS: ${Math.ceil(this.game.loop.actualFps)}      ${Math.ceil(delta)} ms`;
    this.self.controls.update(delta);
  }

  makeHUD(): void {
    // ADD HUD
    // Stat
    this.HUDStat = new ImageHud(this, 0, 0, CST.HUD.BANG_CHI_SO, true, false);
    this.HUDStat.setPosition(this.HUDStat.width * 1.65, window.innerHeight - this.HUDStat.height / 2);
    this.HUDAttack = new ImageHud(this, this.HUDStat.x - 55, this.HUDStat.y - 30, CST.HUD.TAN_CONG, true, false);
    this.HUDMagic = new ImageHud(this, this.HUDStat.x, this.HUDStat.y - 30, CST.HUD.PHEP_THUAT, false, false);
    this.HUDArmor = new ImageHud(this, this.HUDAttack.x, this.HUDAttack.y + 20, CST.HUD.GIAP, false, false);
    this.HUDMagicResistance = new ImageHud(this, this.HUDStat.x, this.HUDMagic.y + 20, CST.HUD.KHANG_PHEP, false, false);
    this.HUDAttackSpeed = new ImageHud(this, this.HUDAttack.x, this.HUDArmor.y + 20, CST.HUD.TOC_DO_DANH, false, false);
    this.HUDReloadSkill = new ImageHud(this, this.HUDStat.x, this.HUDMagicResistance.y + 20, CST.HUD.HOI_CHIEU, false, false);
    this.HUDAttackDistance = new ImageHud(this, this.HUDAttack.x, this.HUDAttackSpeed.y + 20, CST.HUD.TAM_DANH, false, false);
    this.HUDCritical = new ImageHud(this, this.HUDStat.x, this.HUDReloadSkill.y + 20, CST.HUD.CHI_MANG, false, false);

    this.txtHUDAttack = new TextHUD(this, this.HUDAttack.x + 15, this.HUDAttack.y - 6, this.self.champion.attack.toString(), {
      fontStyle: 'bold',
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    });
    this.txtHUDMagic = new TextHUD(this, this.HUDMagic.x + 15, this.HUDMagic.y - 6, this.self.champion.magic.toString(), {
      fontStyle: 'bold',
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    });
    this.txtHUDArmor = new TextHUD(this, this.HUDAttack.x + 15, this.HUDArmor.y - 6, this.self.champion.armor.toString(), {
      fontStyle: 'bold',
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    });
    this.txtHUDMagicResistance = new TextHUD(this, this.HUDMagicResistance.x + 15, this.HUDMagicResistance.y - 6,
      this.self.champion.magicResistance.toString(), {
      fontStyle: 'bold',
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    });
    this.txtHUDAttackSpeed = new TextHUD(this, this.HUDAttackSpeed.x + 15, this.HUDAttackSpeed.y - 6,
      this.self.champion.attackSpeed.toString(), {
      fontStyle: 'bold',
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    });
    this.txtHUDReloadSkill = new TextHUD(this, this.HUDReloadSkill.x + 15, this.HUDReloadSkill.y - 6,
      this.self.champion.reloadSkill.toString(), {
      fontStyle: 'bold',
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    });
    this.txtHUDAttackDistance = new TextHUD(this, this.HUDAttackDistance.x + 15, this.HUDAttackDistance.y - 6,
      this.self.champion.attackDistance.toString(), {
      fontStyle: 'bold',
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    });
    this.txtHUDCritical = new TextHUD(this, this.HUDCritical.x + 15, this.HUDCritical.y - 6,
      this.self.champion.critical.toString(), {
      fontStyle: 'bold',
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    });
    // Avatar and skill
    this.HUDAvatarAndSkill = new ImageHud(this, window.innerWidth / 2.2, this.HUDStat.y,
      CST.HUD.BANG_ANH_DAI_DIEN_VA_KY_NANG, true, false).setDepth(4);
    this.self.champion.getAvatar().setPosition(this.HUDAvatarAndSkill.x - 210, this.HUDAvatarAndSkill.y).setDepth(3);
    this.HUDItem = new ImageHud(this, this.HUDAvatarAndSkill.x + 345, this.HUDAvatarAndSkill.y,
      CST.HUD.BANG_TRANG_BI, true, true);
    this.HUDMap = new ImageHud(this, 0, 0,
      CST.HUD.MAP, true, false);
    this.HUDMap.setPosition(window.innerHeight - this.HUDMap.width, window.innerHeight - this.HUDMap.height);
  }

  makeCAM(): void {
    this.self.cursorKeys = this.input.keyboard.createCursorKeys();
    this.self.cameraMain = this.cameras.main;
    const controlConfig = {
      camera: this.cameras.main,
      left: this.self.cursorKeys.left,
      right: this.self.cursorKeys.right,
      up: this.self.cursorKeys.up,
      down: this.self.cursorKeys.down,
      acceleration: 0.06,
      drag: 0.0005,
      maxSpeed: 1.0
    };
    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    this.self.cameraMain.setBounds(this.cameraBounds.x, this.cameraBounds.y, this.cameraBounds.width, this.cameraBounds.height);
  }

  makeMap(): void {
    const mappy = this.add.tilemap('mappy');
    const terrain = mappy.addTilesetImage('Tileset_Sprite_Sheet', 'terrain', 24, 24);
    const ground = mappy.createStaticLayer('ground', [terrain], 0, 0).setDepth(-2).setScale(.7).setSize(2000, 2000);
    // const botLayer = mappy.createStaticLayer('bot', [terrain], 0, 0);
    const topLayer = mappy.createStaticLayer('top', [terrain], 0, 0).setDepth(-1).setScale(.7);
    // map collisions
    this.physics.add.collider(this.self.champion, topLayer);
    topLayer.setCollisionByProperty({collides: true});
  }

  makeChampionAndEvents(): void {
    this.champion = new CharacterSprite(this, 200, 100, 'CUNG_THU', 'character-20', CST.ATLAS.CHARACTER.CUNG_THU.KEY);
    // @ts-ignore
    window.champion = this.champion;
    // @ts-ignore
    this.self.keys = this.input.keyboard.addKeys('Q, W, E, R, F1');
    // Click to move
    this.self.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 2) {
        this.self.champion.run(pointer.x, pointer.y);
      }
    });
  }
}
