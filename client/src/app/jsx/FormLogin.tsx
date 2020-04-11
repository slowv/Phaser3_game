import React from 'src/assets/jsx-dom-shim';
import {buttonJSX} from './Button';
export const FromRegister = (
  <form action='#' id='formRegister'>
    <img src="assets/images/logo.png" alt="logo"/>
    <label>Tài khoản</label>
    <input type='email' class='slv-input' placeholder='Tài khoản' name={'email'}/>
    <label>Mật khẩu</label>
    <input type='password' class='slv-input' placeholder='Mật khẩu' name={'password'}/>
    {buttonJSX}
  </form>
);
