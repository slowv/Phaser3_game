import {Component, OnInit} from '@angular/core';
// @ts-ignore
import Phaser from 'phaser';
import {Load} from './scenes/Load';
import {Menu} from './scenes/Menu';
import {PlayGame} from './scenes/PlayGame';
import { Login } from './scenes/Login';
import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin.js';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import {RoomWait} from './scenes/RoomWait';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'GAME';
  game: Phaser.Game;
  public WIDTH = 1024;
  public HEIGHT = 576;
  SCENE = [Login, Load, RoomWait, Menu, PlayGame];
  // SCENE = [Load, RoomWait, Menu, PlayGame];

  public ngOnInit(): void {
  }

  // tslint:disable-next-line:use-lifecycle-interface
  public ngAfterViewInit(): void {
    this.game = new Phaser.Game({
      type: Phaser.WEBGL,
      parent: 'game-root',
      dom: {
        createContainer: true
      },
      backgroundColor: 0xffffff,
      width: this.WIDTH,
      height: this.HEIGHT,
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          fps: 120
        }
      },
      render: {
        pixelArt: true
      },
      plugins: {
        scene: [
          {
            key: 'rexBoard',
            plugin: BoardPlugin,
            mapping: 'rexBoard'
          },
          {
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
          },
        ]
      },
      scene: this.SCENE,
      // scale: {
      //   mode: Phaser.Scale.FIT,
      //   autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY
      // },
      fps: {
        min: 30,
        deltaHistory: 60,
        forceSetTimeOut: true
      },
      version: '1.0',
      disableContextMenu: true,
      audio: {
        disableWebAudio: false,
        noAudio: false,
      }
    });
  }
}
