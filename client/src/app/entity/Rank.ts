import {RankEnum} from '../enum/RankEnum';

export class Rank {
  name: string;
  score: number;
  level: number;
  frame: number;
  levelRoman: string;
  constructor(name: string, score: number, level: number, frame: number) {
    this.name = name;
    this.score = score;
    this.level = level;
    this.frame = frame;
    this.levelRoman = this.getLevelRomanByNumber();
  }

  getLevelRomanByNumber(): string {
    if (this.level === 1) {
      return 'I';
    } else if (this.level === 2) {
      return 'II';
    } else if (this.level === 3) {
      return 'III';
    } else if (this.level === 4) {
      return 'IV';
    } else if (this.level === 5) {
      return 'V';
    } else {
      return 'No rank';
    }
  }
}
