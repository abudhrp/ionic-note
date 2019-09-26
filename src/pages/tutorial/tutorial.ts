import { Component, ViewChild } from '@angular/core';

import { MenuController, NavController, Slides } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';

import { WelcomePage } from '../welcome/welcome';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class TutorialPage {
  showSkip = true;

	@ViewChild('slides') slides: Slides;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public userData: UserProvider,
    public storage: Storage
  ) { }

  ionViewDidLoad() {
    this.storage.get(this.userData.HAS_SEEN_TUTORIAL).then((value) => {
      if(value === true){
        this.navCtrl.setRoot(HomePage, {}, {
          animate: true,
          direction: 'forward'
        });
      }
    });
  }

  startApp() {
    this.userData.setHasSeenTutorial();
    // this.storage.get(this.userData.HAS_LOGGED_IN).then((value) => {
    //   if(value === true){
    //     this.navCtrl.setRoot(HomePage, {}, {
    //       animate: true,
    //       direction: 'forward'
    //     });
    //   } else {
    //     this.navCtrl.setRoot(WelcomePage, {}, {
    //       animate: true,
    //       direction: 'forward'
    //     });
    //   }
    // });
    this.navCtrl.setRoot(HomePage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

	ionViewWillEnter() {
		this.slides.update();
	}

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

}
