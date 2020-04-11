import {CST} from '../util/CST';
import firebase from 'firebase/app';
import 'firebase/auth';
import {firebaseConfig} from '../config/firebaseConfig';
// @ts-ignore
import {FromRegister} from '../jsx/FormLogin';
import {Player} from '../entity/Player';

export class Login extends Phaser.Scene {
  firebaseApp!: firebase.app.App;
  constructor() {
    super(CST.SCENES.LOGIN);
  }
  preload(): void {
    this.load.video('audioLogin', 'assets/media/nekko.mp4', 'loadeddata', false, false);
  }
  create() {
    const vid = this.add.video(0, 0, 'audioLogin');
    vid.setDisplaySize(1024, 576).setOrigin(0);
    this.sound.pauseOnBlur = false;
    // vid.play(true);
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
        this.goToScreenPlayGame(new Player(email));
      } else {
        // User is signed out.
        console.log('log-out');
      }
    });
    this.firebaseApp.auth().signOut();
    this.createUILoginForm();
  }

  signIn(email: string, password: string) {
    this.firebaseApp.auth().signInWithEmailAndPassword(email, password)
      .then(result => {
        console.log('dang nhap thanh cong!');
        console.log('----------------------');
        console.log(result);
        this.goToScreenPlayGame(new Player(result.user.email));
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage + '\n' + errorCode);
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
        console.log(errorMessage);
      });
  }

  createUILoginForm() {
    this.add.dom(1024 - 240, 1, FromRegister).setOrigin(0);
    const btnLogin = document.getElementById('btn-login');
    btnLogin.addEventListener('click', (e) => {
      const form = document.forms[0];
      this.signIn(form['email'].value, form['password'].value);
    });
  }

  goToScreenPlayGame(player: Player) {
    this.scene.start(CST.SCENES.LOAD, player);
  }
}
