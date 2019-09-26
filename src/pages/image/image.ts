import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';

/**
 * Generated class for the ImagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image',
  templateUrl: 'image.html',
})
export class ImagePage {

  data : any;
  images : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private photoViewer: PhotoViewer) {
    this.data = navParams.get('data');
    this.showImage();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ImagePage');
  }

  showImage(){
    this.images = [];
    for(var i=0; i < this.data.length; i++){
      this.images.push();
    }
    // this.photoViewer.show();
  }

}
