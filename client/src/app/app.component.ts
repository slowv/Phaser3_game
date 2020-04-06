import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Phaser from 'phaser';
import {Load} from './scenes/Load';
import {Menu} from './scenes/Menu';
import {PlayGame} from './scenes/PlayGame';
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'GAME';
  game: Phaser.Game;
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  SCENE = [Load, Menu, PlayGame];
  public ngOnInit(): void {
  }

  // tslint:disable-next-line:use-lifecycle-interface
  public ngAfterViewInit(): void {
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      width: this.WIDTH,
      height: this.HEIGHT,
      physics: {
        default: 'arcade',
        arcade: {
          debug: true
        }
      },
      render: {
        pixelArt: true
      },
      scene: this.SCENE,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH
      },
      fps: {
        min: 30,
        deltaHistory: 60,
        forceSetTimeOut: true
      },
      version: '1.0',
      disableContextMenu: true,
    });
  }
}
