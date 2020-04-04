import ImagePhaser = Phaser.GameObjects.Image;

export class Skill extends Phaser.Physics.Arcade.Sprite {
  name: string;
  description: string;
  timeLoad: number;
  energy: number;
  health?: number;
  action: any;
  distance: number;
  image: ImagePhaser;
  stack?: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string | number,
              name: string, description: string, timeLoad: number, energy: number, action: any,
              distance: number, image: ImagePhaser, health?: number | null, stack?: number) {
    super(scene, x, y, texture, frame);
    this.name = name;
    this.description = description;
    this.timeLoad = timeLoad;
    this.energy = energy;
    if (null != health) {
      this.health = health;
    }
    this.action = action;
    this.distance = distance;
    this.image = image;
    if (null != stack) {
      this.stack = stack;
    }
  }

  handler(x: number, y: number): void {
    this.action(x, y);
  }

}
