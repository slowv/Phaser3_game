import React from 'src/assets/jsx-dom-shim.js';
import {buttonJSX} from './Button';
export const FromRegister = (
  <form action='#' id='formRegister'>
    <img src='assets/images/logo.png' alt='logo'/>
    <div className={'error'} id={'msg-error-login'}/>
    <label>Tài khoản</label>
    <input type='email' className='slv-input' placeholder='Tài khoản' name={'email'}/>
    <label>Mật khẩu</label>
    <input type='password' className='slv-input' placeholder='Mật khẩu' name={'password'}/>
    {buttonJSX}
    <div className='social-login'>
      <div className={'text-center'}>Đăng nhập bằng</div>
      <ul>
        <li><a id={'facebook'}><i className='mdi mdi-facebook'/></a></li>
        <li><a id={'google'}><i className='mdi mdi-google'/></a></li>
        <li><a id={'github'}><i className='mdi mdi-github-face'/></a></li>
      </ul>
    </div>
  </form>
);
