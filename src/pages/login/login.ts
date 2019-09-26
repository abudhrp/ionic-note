import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { UserProvider } from '../../providers/user/user';
import { loginOptions } from '../../interfaces/user-options';

import { ForgotPage } from '../forgot/forgot';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  signin : loginOptions = {
    username  : '',
    password  : ''
  };
  submitted = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userData: UserProvider,
    public alertCtrl: AlertController,
    private menu: MenuController
  ) {}

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  login(form: NgForm){
    this.submitted = true;
    if(form.valid) {
      let gagal = this.alertCtrl.create({
        title: 'ERROR !',
        subTitle: 'Your login information not found !',
        buttons: ['OK']
      });
      this.userData.login(this.signin.username, this.signin.password)
        .then(data => {
          console.log(data);
          if(data == false){
            gagal.present();
          } else {
            this.navCtrl.setRoot(HomePage, {}, {
              animate: true,
              direction: 'forward'
            });
          }
        })
        .catch( e => console.log(e));
    }
  }

  forgot() {
    this.navCtrl.push(ForgotPage);
  }

}
