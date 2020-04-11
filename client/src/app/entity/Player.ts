import {CharacterSprite} from './CharacterSprite';

export class Player {
  username: string;
  champion: CharacterSprite;

  constructor(username: string) {
    this.username = username;
  }
}
