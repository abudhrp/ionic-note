import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { UserProvider } from '../../providers/user/user';
import { registerOptions } from '../../interfaces/user-options';

import { LoginPage } from '../login/login';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  signup : registerOptions = {
    username  : '',
    email     : '',
    password  : '',
    confirm   : ''
  };
  submitted = false;
  check = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userData: UserProvider,
    public alertCtrl: AlertController,
    private menu: MenuController
  ) { }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  register(form: NgForm){
    this.submitted = true;
    if (form.valid) {
      if(this.signup.password == this.signup.confirm){
        this.userData.register(this.signup.username, this.signup.email, this.signup.password)
        .then( data => {
          console.log(data);
          if(data === false){
            let alert = this.alertCtrl.create({
              title: 'ERROR !',
              subTitle: 'Your registration is failed !',
              buttons: ['OK']
            });
            alert.present();
          } else {
            let alert = this.alertCtrl.create({
              title: 'SUCCESS !',
              subTitle: 'Your registration is success, please login with your account !',
              buttons: ['OK']
            });
            alert.present();
            this.navCtrl.push(LoginPage);
          }
        });
      } else {
        let alert = this.alertCtrl.create({
          title: 'ERROR !',
          subTitle: 'Your password didnt match !',
          buttons: ['OK']
        });
        alert.present();
      }
    }
  }

}
