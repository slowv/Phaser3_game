import {CST} from '../util/CST';
import Image = Phaser.GameObjects.Image;

import {Skill} from './Skill';

export class CharacterSprite extends Phaser.Physics.Arcade.Sprite implements IAction {
    currentHp: number;
    maxHp: number;
    currentEnergy: number;
    maxEnergy: number;
    attack: number;
    armor: number;
    magic: number;
    magicResistance: number;
    speed: number;
    attackSpeed: number;
    healthRegen: number;
    energyRegen: number;
    critical: number;

    animKey = CST.ANIM.CHARACTER;

    champion: any;
    // Skill
    skillQ: Skill;
    skillW: Skill;
    skillE: Skill;
    skillR: Skill;
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number, key?: string) {
        super(scene, x, y, texture, frame);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        this.setScale(0.3);
        scene.physics.world.enableBody(this);
        this.setImmovable(true);
        this.body.setSize(this.width - 30, this.height, true).setOffset(15, 15);
        console.log(CST.ATLAS.CHARACTER[key].ANIMATION);
        // Load animation
        scene.load.animation(CST.ATLAS.CHARACTER[key].ANIMATION, `./assets/images/${CST.ATLAS.CHARACTER[key].ANIMATION}`);
        this.champion = CST.ATLAS.CHARACTER[key];
        // SET PROPERTY
        const properties = this.champion.PROPERTY;
        this.maxHp = properties.HP;
        this.currentHp = this.maxHp;
        this.maxEnergy = properties.ENERGY;
        this.currentEnergy = this.maxEnergy;
        this.attack = properties.ATTACK;
        this.armor = properties.ARMOR;
        this.magic = properties.MAGIC;
        this.magicResistance = properties.MAGIC_RESISTANCE;
        this.speed = properties.SPEED;
        this.attackSpeed = properties.ATTACK_SPEED;
        this.healthRegen = properties.HEALTH_REGEN;
        this.energyRegen = properties.ENERGY_REGEN;
        this.critical = properties.CRITICAL;
        this.scene = scene;

        const skillInformation = this.champion.SKILL;
        this.skillQ = new Skill(scene, this.body.x, this.body.y,
            skillInformation.Q.TEXTURE,
            skillInformation.Q.FRAME,
            skillInformation.Q.NAME,
            skillInformation.Q.DESCRIPTION,
            skillInformation.Q.TIME_LOAD,
            skillInformation.Q.ENERGY,
            skillInformation.Q.ACTION,
            skillInformation.Q.DISTANCE,
            new Image(scene, 100, 100, skillInformation.Q.IMAGE.TEXTURE, skillInformation.Q.IMAGE.FRAME)
        );

        this.skillW = new Skill(scene, this.body.x, this.body.y,
            skillInformation.W.TEXTURE,
            skillInformation.W.FRAME,
            skillInformation.W.NAME,
            skillInformation.W.DESCRIPTION,
            skillInformation.W.TIME_LOAD,
            skillInformation.W.ENERGY,
            skillInformation.W.ACTION,
            skillInformation.W.DISTANCE,
            new Image(scene, 100, 100, skillInformation.W.IMAGE.TEXTURE, skillInformation.W.IMAGE.FRAME)
            );

        this.skillE = new Skill(scene, this.body.x, this.body.y,
            skillInformation.E.TEXTURE,
            skillInformation.E.FRAME,
            skillInformation.E.NAME,
            skillInformation.E.DESCRIPTION,
            skillInformation.E.TIME_LOAD,
            skillInformation.E.ENERGY,
            skillInformation.E.ACTION,
            skillInformation.E.DISTANCE,
            new Image(scene, 100, 100, skillInformation.E.IMAGE.TEXTURE, skillInformation.E.IMAGE.FRAME),
            null,
            skillInformation.E.STACK
        );

        this.skillR = new Skill(scene, this.body.x, this.body.y,
            skillInformation.R.TEXTURE,
            skillInformation.R.FRAME,
            skillInformation.R.NAME,
            skillInformation.R.DESCRIPTION,
            skillInformation.R.TIME_LOAD,
            skillInformation.R.ENERGY,
            skillInformation.R.ACTION,
            skillInformation.R.DISTANCE,
            new Image(scene, 100, 100, skillInformation.R.IMAGE.TEXTURE, skillInformation.R.IMAGE.FRAME),
        );

    }

    use_q(x: number, y: number): void {
        this.skillQ.handler(x, y);
    }

    use_w(): void {
        throw new Error('Method not implemented.');
    }

    use_e(): void {
        throw new Error('Method not implemented.');
    }

    use_r(): void {
        throw new Error('Method not implemented.');
    }

    base(): void {
        throw new Error('Method not implemented.');
    }

    minusHealth(amount: number): void {
        this.currentHp = this.currentHp - amount;
        if (this.currentHp < 0) {
            this.death();
        }
    }

    plusHealth(amount: number): void {
        const healthTemp = this.currentHp + amount;
        if (healthTemp > this.maxHp) {
            this.currentHp = this.maxHp;
        } else {
            this.currentHp = healthTemp;
        }
    }

    attack_normal(objTarget: CharacterSprite) {
        this.anims.play(this.animKey.ATTACK_LEFT);
        objTarget.minusHealth(this.attack - objTarget.armor);
    }

    death() {
        this.anims.play(this.animKey.HURT);
        this.destroy();
    }

    runDown(): void {

    }

    runLeft(x: number, y: number): void {
        this.anims.play(this.animKey.RUN_LEFT);
        this.scene.physics.moveTo(this, x, y, this.speed, 300);
    }

    runRight(): void {
    }

    runUp(): void {
    }

}
