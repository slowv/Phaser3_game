import {CharacterSprite} from './CharacterSprite';

export class Player {
  id: string;
  username: string;
  champion: CharacterSprite;
  email: string;
  photoURL: string;
  level: number;
  exp: number;
  expNextLevel: number;
  userPlayName: string;

  constructor(username: string, email: string, id: string, photoURL: string) {
    this.username = username;
    this.email = email;
    this.id = id;
    this.photoURL = photoURL;
  }

  setChampion(champion: CharacterSprite): Player {
    this.champion = champion;
    return this;
  }

  getNewPlayer(player: Player, userPlayName: string) {
    player.exp = 0;
    player.expNextLevel = 100;
    player.userPlayName = userPlayName;
    player.level = 1;
    if (null === player.photoURL || undefined === player.photoURL) {
      player.photoURL = 'https://scontent-hkg4-1.xx.fbcdn.net/v/t31.0-8/s960x960/13483381_501764040019059_8369060431906599477_o.jpg?' +
        '_nc_cat=100&_nc_sid=e007fa&_nc_ohc=wdzgTLYMqW4AX8MxB4f&' +
        '_nc_ht=scontent-hkg4-1.xx&_nc_tp=7&oh=ee3de1e0e608281f33bda17210683140&oe=5EBA5499';
    }
    return player;
  }
}
