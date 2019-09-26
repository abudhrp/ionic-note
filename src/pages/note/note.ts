import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { FolderProvider } from '../../providers/folder/folder';
import { NoteProvider } from '../../providers/note/note';
import { Item } from '../../models/item';

import { AddnotePage } from '../addnote/addnote';
import { HomePage } from '../home/home';
import { DetailPage } from '../detail/detail';

/**
 * Generated class for the NotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-note',
  templateUrl: 'note.html',
})
export class NotePage {

  notes: any;
  images: any;
  id: any;
  item: any;
  public photos: any;
  public base64Image: string;
  visible = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public modalCtrl: ModalController,
    public noteData: NoteProvider,
    private platform: Platform
  ) {
    this.notes = [];
    this.id = navParams.get('id');
    this.item = navParams.get('item');
    this.getListNote();
  }

  ngOnInit() {
    this.getListNote();
  }

  ionViewWillEnter() {
    // console.log('ionViewDidLoad NotePage');
    this.getListNote();
  }

  search() {
   this.visible = !this.visible;
  }

  onSearch(keyword: any){
    let val = keyword.target.value;
    if (val && val.trim() != '') {
      this.notes = this.noteData.search(val);
    } else {
      this.getListNote();
    }
  }

  getListNote() {
    this.noteData.getNotes(this.id)
      .then(data => {
        if (data != null) {
          if (data.length > 0) {
            this.notes = data;
            this.images = [];
            for (var z = 0; z < data.length; z++) {
              this.noteData.getImages(data[z].id)
                .then(hasil => {
                  if (hasil != null) {
                    if (hasil.length > 0) {
                      // this.images = hasil[0];
                      this.images.push(hasil[0].imageUrl);
                    } else {
                      console.log('gambar notes kosong');
                      this.images.push('');
                    }
                  } else {
                    this.images.push('');
                  }
                })
                .catch(e => {
                  console.log(e);
                });
            }
          } else {
            console.log('notes kosong.');
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  addItem() {
    let addModal = this.modalCtrl.create(AddnotePage, {
      id_folder: this.id,
      foldername: this.item
    });
    addModal.onDidDismiss(item => {
      if (item) {
        console.log(item);
      }
    })
    addModal.present();
  }

  doRefresh(refresher) {
    this.getListNote();
    setTimeout(() => {
      refresher.complete();
    }, 3000);
  }

  backtofolder() {
    this.navCtrl.setRoot(HomePage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

  openItem(id, title, folder, id_folder) {
    this.navCtrl.push(DetailPage, {
      id_note: id,
      judul: title,
      folder: folder,
      id_folder: id_folder
    });
  }

}
