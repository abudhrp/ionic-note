import { Component } from '@angular/core';
import { NavController, ViewController, MenuController, AlertController } from 'ionic-angular';

import { NoteProvider } from '../../providers/note/note';
import { Item } from '../../models/item';

import { NotePage } from '../note/note';
import { DetailPage } from '../detail/detail';

/**
 * Generated class for the MynotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-mynote',
  templateUrl: 'mynote.html',
})
export class MynotePage {

  notes: any;
  images: any;
  visible = false;

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private menu: MenuController,
    public alertCtrl: AlertController,
    public noteData: NoteProvider
  ) {
    this.notes = [];
    this.getListNote();
  }

  ionViewWillEnter() {
    this.menu.enable(true);
    this.viewCtrl.showBackButton(false);
  }

  search() {
    this.visible = !this.visible;
  }

  getListNote() {
    this.noteData.getAllNotes()
      .then(data => {
        if (data != null) {
          if (data.length > 0) {
            this.notes = data;
            this.images = [];
            for (var z = 0; z < data.length; z++) {
              this.noteData.getImages(data[z].id_note)
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

  onSearch(keyword: any){
    let val = keyword.target.value;
    if (val && val.trim() != '') {
      this.notes = this.noteData.searchAll(val);
    } else {
      this.getListNote();
    }
  }

  openItem(id, title, folder, id_folder) {
    this.navCtrl.push(DetailPage, {
      id_note: id,
      judul: title,
      folder: folder,
      id_folder: id_folder
    });
  }

  doRefresh(refresher) {
    this.notes = this.noteData.getAllNote();
    setTimeout(() => {
      refresher.complete();
    }, 3000);
  }

}
