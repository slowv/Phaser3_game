import React from 'src/assets/jsx-dom-shim';
import {buttonJSX} from './Button';
export const FromRegister = (
  <form action='#' id='formRegister'>
    <img src="assets/images/logo.png" alt="logo"/>
    <div className={'error'} id={'msg-error-login'} style={'font-size: 12px; color: #ff9800; font-style: italic'}></div>
    <label>Tài khoản</label>
    <input type='email' class='slv-input' placeholder='Tài khoản' name={'email'}/>
    <label>Mật khẩu</label>
    <input type='password' class='slv-input' placeholder='Mật khẩu' name={'password'}/>
    {buttonJSX}
    <div class='social-login'>
      <div className={'text-center'}>Đăng nhập bằng</div>
      <ul>
        <li><a id={'facebook'}><i className={'mdi mdi-facebook'}></i></a></li>
        <li><a id={'google'}><i className={'mdi mdi-google'}></i></a></li>
        <li><a id={'github'}><i className={'mdi mdi-github-face'}></i></a></li>
      </ul>
    </div>
  </form>
);
