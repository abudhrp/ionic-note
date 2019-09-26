import { Component } from '@angular/core';
import { NavController, ViewController, MenuController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { NoteProvider } from '../../providers/note/note';
import { Item } from '../../models/item';

import { DetailPage } from '../detail/detail';
import { AddnotePage } from '../addnote/addnote';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  notes: any;
  images: any;
  visible = false;

  public photos: any;
  public imageList: any;
  public base64Image: string;

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private menu: MenuController,
    public alertCtrl: AlertController,
    public noteData: NoteProvider,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera
  ) {
    this.getListNote();
    this.notes = this.noteData.getAllNote();
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

  newfolder() {
    // let alert = this.alertCtrl.create({
    //   title: 'Create Folder',
    //   inputs: [
    //     {
    //       id: 'folder',
    //       name: 'folder',
    //       placeholder: 'Folder Name'
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel'
    //     },
    //     {
    //       text: 'Create',
    //       handler: data => {
    //         this.folderData.create(data.folder)
    //           .then(data => {
    //             if (data === false) {
    //               let alert = this.alertCtrl.create({
    //                 title: 'ERROR !',
    //                 subTitle: 'Create folder failed !',
    //                 buttons: ['OK']
    //               });
    //               alert.present();
    //             } else {
    //               this.currentItems = this.folderData.getFolderList();
    //               let alert = this.alertCtrl.create({
    //                 title: 'SUCCESS !',
    //                 subTitle: 'Create folder success !',
    //                 buttons: ['OK']
    //               });
    //               alert.present();
    //             }
    //           })
    //       }
    //     }
    //   ]
    // });
    // alert.present();
  }

  editdata(id) {
    // this.folderData.getFolderById(id)
    //   .then(result => {
    //     let alert = this.alertCtrl.create({
    //       title: 'Edit Folder',
    //       inputs: [
    //         {
    //           id: 'folder',
    //           name: 'folder',
    //           placeholder: 'Folder Name',
    //           value: result[0].foldername
    //         }
    //       ],
    //       buttons: [
    //         {
    //           text: 'Cancel',
    //           role: 'cancel'
    //         },
    //         {
    //           text: 'Edit',
    //           handler: data => {
    //             // console.log(data);
    //             this.folderData.update(id, data.folder)
    //               .then(data => {
    //                 if (data === false) {
    //                   let alert = this.alertCtrl.create({
    //                     title: 'ERROR !',
    //                     subTitle: 'Edit folder failed !',
    //                     buttons: ['OK']
    //                   });
    //                   alert.present();
    //                 } else {
    //                   this.currentItems = this.folderData.getFolderList();
    //                   let alert = this.alertCtrl.create({
    //                     title: 'SUCCESS !',
    //                     subTitle: 'Edit folder success !',
    //                     buttons: ['OK']
    //                   });
    //                   alert.present();
    //                 }
    //               })
    //           }
    //         }
    //       ]
    //     });
    //     alert.present();
    //   });
  }

  deletedata(id) {
    // this.folderData.getFolderById(id)
    //   .then(result => {
    //     let alert = this.alertCtrl.create({
    //       title: 'Confirm delete',
    //       message: 'Do you want to delete this folder?',
    //       buttons: [
    //         {
    //           text: 'No',
    //           role: 'no',
    //           handler: () => {
    //             console.log('Cancel clicked');
    //           }
    //         },
    //         {
    //           text: 'Yes',
    //           handler: () => {
    //             this.folderData.delete(id)
    //               .then( () => {
    //                 this.currentItems = this.folderData.getFolderList();
    //                 let alert = this.alertCtrl.create({
    //                   title: 'SUCCESS !',
    //                   subTitle: 'Delete folder success !',
    //                   buttons: ['OK']
    //                 });
    //                 alert.present();
    //               })
    //           }
    //         }
    //       ]
    //     });
    //     alert.present();
    //   });
  }

  onSearch(keyword: any) {
    if (keyword.data != null) {
      this.noteData.search(keyword.target.value)
        .then(data => {
          this.notes = this.noteData.getNoteList();
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      this.notes = this.noteData.getAllNote();
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

  pilihupload() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Upload Image',
      buttons: [
        {
          text: 'Take Photo',
          role: 'photo',
          icon: 'camera',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Choose from Gallery',
          role: 'gallery',
          icon: 'images',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
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

  addnote(){
    this.navCtrl.push(AddnotePage, {
      base64: this.photos,
      images: this.imageList
    });
  }

  takePhoto(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.navCtrl.push(AddnotePage, {
        base64: this.base64Image,
        images: imageData
      });
    }, (err) => {
      this.presentToast('Error while selecting image.');
      console.log(err);
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

}
