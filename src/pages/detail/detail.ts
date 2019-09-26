import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController, AlertController } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { NoteProvider } from '../../providers/note/note';

import { ImagePage } from '../image/image';
import { EditnotePage } from '../editnote/editnote';
import { NotePage } from '../note/note';
import { HomePage } from '../home/home';

/**
 * Generated class for the DetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  id_note : any;
  id_folder : any;
  judul   : any;
  images  : any;
  id_gambar: any;
  item    : any;
  folder  : any;
  isinote : any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public noteData: NoteProvider,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    private photoViewer: PhotoViewer,
    public alertCtrl: AlertController
  )
  {
    this.id_note  = navParams.get('id_note');
    this.judul    = navParams.get('judul');
    this.folder   = navParams.get('folder');
    this.id_folder= navParams.get('id_folder');
    this.getNotesByIdNote();
  }

  ngOnInit() {
    this.images = [];
    this.id_gambar = [];
  }

  getNotesByIdNote(){
    this.noteData.getNoteById(this.id_note)
    .then( data => {
      this.item = data[0];
      this.isinote = data[0].note;
      this.noteData.getImages(data[0].id)
      .then( hasil => {
        if(hasil != null){
          if(hasil.length > 0){
            for(var a = 0; a < hasil.length; a++){
              this.images.push(hasil[a].imageUrl);
              this.id_gambar.push(hasil[a].id);
            }
          }
        }
      })
      .catch( e => {
        console.log(e);
      });
    })
    .catch( e => {
      console.log(e);
    })
  }

  showImage(image,title){
    this.photoViewer.show(image,title);
    // let imageModal = this.modalCtrl.create(ImagePage, { data : album });
    // imageModal.present();
  }

  options(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Note Options',
      buttons: [
        {
          text: 'Edit Note',
          role: 'edit',
          icon: 'ios-create-outline',
          handler: () => {
            console.log('Edit');
            this.editNote(this.id_note, this.judul, this.folder, this.images, this.id_gambar, this.isinote, this.id_folder);
          }
        },
        {
          text: 'Delete Note',
          role: 'delete',
          icon: 'trash',
          handler: () => {
            console.log('Delete')
            this.deleteNote(this.id_note, this.id_folder);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  editNote(id, judul, folder, images, id_gambar, isinote, id_folder) {
    this.navCtrl.push(EditnotePage, {
      id_note: id,
      judul: judul,
      folder: folder,
      images: images,
      id_gambar: id_gambar,
      isinote: isinote,
      id_folder: id_folder
    });
  }

  deleteNote(id_note, id_folder){
    this.noteData.getNoteById(id_note)
      .then(result => {
        let alert = this.alertCtrl.create({
          title: 'Confirm delete',
          message: 'Do you want to delete this note?',
          buttons: [
            {
              text: 'No',
              role: 'no',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {
                this.noteData.delete(id_note, id_folder)
                  .then( () => {
                    this.navCtrl.setRoot(HomePage)
                    .then( () => {
                      let alert = this.alertCtrl.create({
                        title: 'SUCCESS !',
                        subTitle: 'Delete note success !',
                        buttons: ['OK']
                      });
                      alert.present();
                    });
                  })
              }
            }
          ]
        });
        alert.present();
      });
  }

}
