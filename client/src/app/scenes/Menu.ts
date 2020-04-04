import {CST} from '../util/CST';

export class Menu extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.MENU
        });
    }

    init() {
        console.log('MENU');
    }

    create(): void {
        const bg = this.add.image(0, 0, CST.IMAGE.BG).setOrigin(0).setDepth(-1);
        bg.setDisplaySize(this.game.renderer.width, this.game.renderer.height);
        // let head_kn_hover = this.add.image(0, 0, CST.IMAGE.HEAD).setScale(.18).setVisible(false);

        const btnPlay = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, CST.IMAGE.BTN_PLAY);

        btnPlay.setInteractive();

        btnPlay.on('pointerover', () => {
            // head_kn_hover.setVisible(true);
            // head_kn_hover.x = btn_play.x - btn_play.width;
            // head_kn_hover.y = btn_play.y;
        });

        btnPlay.on('pointerout', () => {
            // head_kn_hover.setVisible(false);
        });
        btnPlay.on('pointerup', () => {
            this.sound.pauseAll();
            this.scene.start(CST.SCENES.LEVEL_1);
        });

        this.sound.pauseOnBlur = false;
        // this.sound.play(CST.AUDIO.BG_MUSIC, {loop: true})
    }
}
