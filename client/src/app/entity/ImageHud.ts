export class ImageHud extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, isAlpha: boolean, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.setScrollFactor(0);
    if (isAlpha) {
      this.setAlpha(.8);
    }
    this.setScale(1.6);
    this.setOrigin(0);
    this.setDepth(2);
    scene.add.existing(this);
  }
}
