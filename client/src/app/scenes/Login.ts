import {CST} from '../util/CST';
import firebase from 'firebase/app';
import 'firebase/auth';
import {firebaseConfig} from '../config/firebaseConfig';
// @ts-ignore
import {FromRegister} from '../jsx/FormLogin';
import {Player} from '../entity/Player';

export class Login extends Phaser.Scene {
  firebaseApp!: firebase.app.App;
  vid!: Phaser.GameObjects.Video;
  bg: Phaser.GameObjects.Image;
  cursor: Phaser.Input.InputPlugin;
  constructor() {
    super(CST.SCENES.LOGIN);
  }

  preload(): void {
    // this.load.video('mediaLogin', './assets/media/ys.mp4', 'canplay', true, false);
    this.load.setPath('./assets/images/');
    this.load.image(`bg`, `bg_login1.jpg`);
  }

  create() {
    // this.vid = this.add.video(0, 0, 'mediaLogin');
    // this.vid.setDisplaySize(1024, 576).setOrigin(0);
    // this.vid.play(true).setLoop(true).setFlipX(true);
    this.cursor = this.input.setDefaultCursor('url(./assets/images/cursor/cursor_06.png), pointer');
    this.bg = this.add.image(0, 0, 'bg').setDisplaySize(1024, 576).setOrigin(0);
    this.firebaseApp = firebase.initializeApp(firebaseConfig);
    this.firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        const displayName = user.displayName;
        const email = user.email;
        const emailVerified = user.emailVerified;
        const photoURL = user.photoURL;
        const isAnonymous = user.isAnonymous;
        const uid = user.uid;
        const providerData = user.providerData;
        this.goToScreenLoad(new Player(email));
      } else {
        // User is signed out.
        console.log('log-out');
      }
    });
    this.firebaseApp.auth().signOut();
    this.createUILoginForm();
  }

  update(time: number, delta: number): void {
  }

  signIn(email: string, password: string) {
    this.firebaseApp.auth().signInWithEmailAndPassword(email, password)
      .then(result => {
        console.log('dang nhap thanh cong!');
        console.log('----------------------');
        console.log(result);
        this.goToScreenLoad(new Player(result.user.email));
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        let elm = document.getElementById('msg-error-login');
        elm.innerHTML = errorMessage;
        setTimeout(() => {
          elm.innerHTML = '';
        }, 4 * 1000);
      });
  }

  signUp(email: string, password: string) {
    // create new user
    this.firebaseApp.auth().createUserWithEmailAndPassword(email, password)
      .then(result => {
        console.log('dang ky thanh cong!');
        console.log('----------------------');
        console.log(result);
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
      });
  }

  createUILoginForm() {
    // @ts-ignore
    this.add.dom(1024 - 240, 1, FromRegister).setOrigin(0);
    const btnLogin = document.getElementById('btn-login');
    btnLogin.addEventListener('click', (e) => {
      const form = document.forms[0];
      this.signIn(form['email'].value, form['password'].value);
    });
    document.onkeypress = (e) => {
      if (e.keyCode === 13) {
        const form = document.forms[0];
        this.signIn(form['email'].value, form['password'].value);
      }
    };

    document.getElementById('google').addEventListener('click', () => {
      alert('1');
    });
  }

  goToScreenLoad(player: Player) {
    this.scene.start(CST.SCENES.LOAD, player);
  }
}
