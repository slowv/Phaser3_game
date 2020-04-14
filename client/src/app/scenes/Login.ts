import {CST} from '../util/CST';
import firebase from 'firebase/app';
import 'firebase/auth';
import {firebaseConfig} from '../config/firebaseConfig';
// @ts-ignore
import {FromRegister} from '../jsx/FormLogin';
import {Player} from '../entity/Player';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;
import GithubAuthProvider = firebase.auth.GithubAuthProvider;
import AuthProvider = firebase.auth.AuthProvider;

export class Login extends Phaser.Scene {
  firebaseApp!: firebase.app.App;
  vid!: Phaser.GameObjects.Video;
  bg: Phaser.GameObjects.Image;
  providerGG: GoogleAuthProvider;
  providerFB: FacebookAuthProvider;
  providerGIT: GithubAuthProvider;
  user: firebase.User;

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
    this.bg = this.add.image(0, 0, 'bg').setDisplaySize(1024, 576).setOrigin(0);
    this.make.text({
      x: 10,
      y: this.cameras.main.height - 20,
      text: `Version: ${this.game.config.gameVersion} - client main`,
      style: {
        font: '12px monospace',
        fill: '#ffffff'
      }
    }).setDepth(99);
    this.firebaseApp = firebase.initializeApp(firebaseConfig);
    this.providerGG = new firebase.auth.GoogleAuthProvider();
    this.providerFB = new firebase.auth.FacebookAuthProvider();
    this.user = this.firebaseApp.auth().currentUser;
    if (this.user != null) {
      const name = this.user.displayName;
      const email = this.user.email;
      const photoUrl = this.user.photoURL;
      const emailVerified = this.user.emailVerified;
      const uid = this.user.uid;
      const photoURL = this.user.photoURL;
      this.goToScreenLoad(new Player(name, email, uid, photoURL));
    } else {
      // DEV login
      this.signIn('test@gmail.com', 'viet1998');
    }
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
        this.goToScreenLoad(new Player(result.user.displayName, result.user.email, result.user.uid, result.user.photoURL));
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
      this.signInBySocial(this.providerGG);
    });
    document.getElementById('facebook').addEventListener('click', () => {
      this.signInBySocial(this.providerFB);
    });
    document.getElementById('github').addEventListener('click', () => {
      this.signInBySocial(this.providerGIT);
    });
  }

  signInBySocial(provider: AuthProvider) {
    this.firebaseApp.auth().signInWithPopup(provider).then((result) => {
      // @ts-ignore
      const token = result.credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(token);
      console.log(user);
      this.goToScreenLoad(new Player(user.displayName, user.email, user.uid, user.photoURL));
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      console.log(errorCode);
      console.log(errorMessage);
      console.log(credential);
      console.log(email);
    });
  }

  goToScreenLoad(player: Player) {
    this.scene.start(CST.SCENES.LOAD, player);
  }
}
