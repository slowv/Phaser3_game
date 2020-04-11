import {CST} from '../util/CST';
import {CharacterSprite} from '../entity/CharacterSprite';
import {ImageHud} from '../entity/ImageHud';
import {TextHUD} from '../entity/TextHUD';
import PhaserNavMeshPlugin from 'phaser-navmesh/dist/phaser-navMesh.js';
import {Player} from '../entity/Player';

export class PlayGame extends Phaser.Scene {
  champion!: CharacterSprite;
  // Map
  tilemap!: Phaser.Tilemaps.Tilemap;
  topLayer !: Phaser.Tilemaps.StaticTilemapLayer;
  pointer!: Phaser.Input.Pointer;
  textFPS!: Phaser.GameObjects.Text;
  self !: PlayGame;
  cameraMain !: Phaser.Cameras.Scene2D.Camera;
  miniCam !: Phaser.Cameras.Scene2D.Camera;
  controls!: Phaser.Cameras.Controls.SmoothedKeyControl;
  cameraBounds = {
    x: 0,
    y: 0,
    width: 3360,
    height: 3360
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
  txtLevel: TextHUD;
  avatar: ImageHud;
  circleLevel: Phaser.GameObjects.Arc;
  iconAvatarMiniMap: ImageHud;

  constructor() {
    super({
      key: CST.SCENES.PLAY
    });
  }

  init(player: Player) {
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
    this.textFPS = new TextHUD(this, 1500, -355, '0 fps', {
      fontSize: '30px',
      fontFamily: 'Monospace',
      color: '#ffffff',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    }).setDepth(3);
    // CAM
    this.makeCAM();
    this.makeHUD();
    // Loại bỏ game object ko cần thiết ra khỏi camera MINI
    this.miniCam.ignore([
      this.HUDStat,
      this.HUDAttack,
      this.HUDMagic,
      this.HUDArmor,
      this.HUDMagicResistance,
      this.HUDAttackSpeed,
      this.HUDReloadSkill,
      this.HUDAttackDistance,
      this.HUDCritical,
      this.HUDAvatarAndSkill,
      this.HUDItem,
      this.HUDMap,
      this.txtHUDAttack,
      this.txtHUDMagic,
      this.txtHUDArmor,
      this.txtHUDMagicResistance,
      this.txtHUDAttackSpeed,
      this.txtHUDReloadSkill,
      this.txtHUDAttackDistance,
      this.txtHUDCritical,
      this.txtLevel,
      this.avatar,
      this.circleLevel,
      this.textFPS,
      this.champion
    ]);
    this.iconAvatarMiniMap = this.champion.avatarMap;
    // Loại bỏ icon champion ra khỏi camera chính
    this.cameraMain.ignore(this.iconAvatarMiniMap);
    // Phóng to icon champion map mini
    this.iconAvatarMiniMap.setScale(3);
  }

  // EVENT FUNCTION
  update(time: number, delta: number): void {
    this.self.textFPS.text = `FPS: ${Math.ceil(this.game.loop.actualFps)}    ${Math.ceil(delta)} ms`;
    this.self.txtLevel.text = this.self.champion.level.toString();
    // update cho vị trí icon champion map di chuyển theo champion
    this.iconAvatarMiniMap.x = this.self.champion.x;
    this.iconAvatarMiniMap.y = this.self.champion.y;
  }

  makeHUD(): void {
    // ADD HUD
    // Stat
    // @ts-ignore
    this.HUDStat = new ImageHud(this, -670, 740, CST.HUD.BANG_CHI_SO, true).setScale(1.6);
    this.HUDAttack = new ImageHud(this, this.HUDStat.x + 30 , this.HUDStat.y + 20, CST.HUD.TAN_CONG, true);
    this.HUDMagic = new ImageHud(this, this.HUDStat.x + 170, this.HUDStat.y + 20, CST.HUD.PHEP_THUAT, false);
    this.HUDArmor = new ImageHud(this, this.HUDAttack.x, this.HUDAttack.y + 55, CST.HUD.GIAP, false);
    this.HUDMagicResistance = new ImageHud(this, this.HUDMagic.x, this.HUDMagic.y + 55, CST.HUD.KHANG_PHEP, false);
    this.HUDAttackSpeed = new ImageHud(this, this.HUDAttack.x, this.HUDArmor.y + 55, CST.HUD.TOC_DO_DANH, false);
    this.HUDReloadSkill = new ImageHud(this, this.HUDMagic.x, this.HUDMagicResistance.y + 55, CST.HUD.HOI_CHIEU, false);
    this.HUDAttackDistance = new ImageHud(this, this.HUDAttack.x, this.HUDAttackSpeed.y + 55, CST.HUD.TAM_DANH, false);
    this.HUDCritical = new ImageHud(this, this.HUDMagic.x, this.HUDReloadSkill.y + 55, CST.HUD.CHI_MANG, false);

    this.txtHUDAttack = new TextHUD(this, this.HUDAttack.x + 50, this.HUDAttack.y + 7, this.self.champion.attack.toString(), {
      fontStyle: 'bold',
      fontSize: '25px',
      fontFamily: 'Monospace',
      color: '#fff4af',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    });
    this.txtHUDMagic = new TextHUD(this, this.HUDMagic.x + 50, this.HUDMagic.y + 7, this.self.champion.magic.toString(), {
      fontStyle: 'bold',
      fontSize: '25px',
      fontFamily: 'Monospace',
      color: '#fff4af',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    });
    this.txtHUDArmor = new TextHUD(this, this.HUDAttack.x + 50, this.HUDArmor.y + 7, this.self.champion.armor.toString(), {
      fontStyle: 'bold',
      fontSize: '25px',
      fontFamily: 'Monospace',
      color: '#fff4af',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    });
    this.txtHUDMagicResistance = new TextHUD(this, this.HUDMagicResistance.x + 50, this.HUDMagicResistance.y + 7,
      this.self.champion.magicResistance.toString(), {
        fontStyle: 'bold',
        fontSize: '25px',
        fontFamily: 'Monospace',
        color: '#fff4af',
        align: 'center',  // 'left'|'center'|'right'|'justify'
        backgroundColor: 'transparent'
      });
    this.txtHUDAttackSpeed = new TextHUD(this, this.HUDAttackSpeed.x + 50, this.HUDAttackSpeed.y + 7,
      this.self.champion.attackSpeed.toString(), {
        fontStyle: 'bold',
        fontSize: '25px',
        fontFamily: 'Monospace',
        color: '#fff4af',
        align: 'center',  // 'left'|'center'|'right'|'justify'
        backgroundColor: 'transparent'
      });
    this.txtHUDReloadSkill = new TextHUD(this, this.HUDReloadSkill.x + 50, this.HUDReloadSkill.y + 7,
      this.self.champion.reloadSkill.toString(), {
        fontStyle: 'bold',
        fontSize: '25px',
        fontFamily: 'Monospace',
        color: '#fff4af',
        align: 'center',  // 'left'|'center'|'right'|'justify'
        backgroundColor: 'transparent'
      });
    this.txtHUDAttackDistance = new TextHUD(this, this.HUDAttackDistance.x + 50, this.HUDAttackDistance.y + 7,
      this.self.champion.attackDistance.toString(), {
        fontStyle: 'bold',
        fontSize: '25px',
        fontFamily: 'Monospace',
        color: '#fff4af',
        align: 'center',  // 'left'|'center'|'right'|'justify'
        backgroundColor: 'transparent'
      });
    this.txtHUDCritical = new TextHUD(this, this.HUDCritical.x + 50, this.HUDCritical.y + 7,
      this.self.champion.critical.toString(), {
        fontStyle: 'bold',
        fontSize: '25px',
        fontFamily: 'Monospace',
        color: '#fff4af',
        align: 'center',  // 'left'|'center'|'right'|'justify'
        backgroundColor: 'transparent'
      });
    // Avatar and skill
    this.HUDAvatarAndSkill = new ImageHud(this, 0, 0,
      CST.HUD.BANG_ANH_DAI_DIEN_VA_KY_NANG, true).setDepth(4)
      .setPosition(this.HUDStat.x + this.HUDStat.width + 70, this.HUDStat.y - 40);
    this.avatar = this.self.champion.getAvatar().setPosition(this.HUDAvatarAndSkill.x + 10, this.HUDAvatarAndSkill.y + 50).setDepth(3);
    this.HUDItem = new ImageHud(this, this.HUDAvatarAndSkill.x + this.HUDAvatarAndSkill.width + 450, this.HUDAvatarAndSkill.y + 18,
      CST.HUD.BANG_TRANG_BI, true);
    // @ts-ignore
    this.HUDMap = new ImageHud(this, 1260, 495,
      CST.HUD.MAP, true).setScale(1.6);
    this.circleLevel = this.add.circle(this.avatar.x + 155, this.avatar.y + 183, 50, 0x202410, 1)
      .setDepth(5)
      .setScrollFactor(0).setScale(.45);
    this.txtLevel = new TextHUD(this, this.circleLevel.x - 5 , this.circleLevel.y - 12, this.self.champion.level.toString(), {
      fontSize: '25px',
      fontFamily: 'Monospace',
      color: '#ffffff',
      align: 'center',  // 'left'|'center'|'right'|'justify'
      backgroundColor: 'transparent'
    }).setDepth(5);
  }

  makeCAM(): void {
    this.self.cameraMain = this.cameras.main;
    this.cameraMain.setZoom(.4);
    this.self.cameraMain.startFollow(this.self.champion);
    this.self.cameraMain.setBounds(this.cameraBounds.x, this.cameraBounds.y, this.cameraBounds.width, this.cameraBounds.height);
    this.miniCam = this.cameras.add(667, 208,
      340, 370);
    this.miniCam.setZoom(.053).setScene(this);
    this.physics.world.setBounds(0, 0, this.cameraBounds.width, this.cameraBounds.height, true, true, true, true);
  }

  makeMap(): void {
    this.tilemap = this.add.tilemap('mappy');
    const terrain = this.tilemap.addTilesetImage('Tileset_Sprite_Sheet', 'terrain', 24, 24);
    const ground = this.tilemap.createStaticLayer('ground', [terrain], 0, 0).setDepth(-2);
    // const botLayer = mappy.createStaticLayer('bot', [terrain], 0, 0);
    this.topLayer = this.tilemap.createStaticLayer('top', [terrain], 0, 0).setDepth(-1);
    // map collisions
    this.physics.add.collider(this.self.champion, this.topLayer);
    this.topLayer.setCollisionByProperty({collides: true});
    this.topLayer.setCollision([269, 270, 271, 301, 302, 303, 333, 334, 335]);
    this.topLayer.renderDebug(this.add.graphics(), {
      tileColor: null, // non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles,
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
    });
  }

  makeChampionAndEvents(): void {

    // Visualize an individual path
    this.champion = new CharacterSprite(this, 300, 200, 'cung_thu', 'character-20', CST.ATLAS.CHARACTER.CUNG_THU.KEY);
    // @ts-ignore
    window.champion = this.champion;
  }

}
