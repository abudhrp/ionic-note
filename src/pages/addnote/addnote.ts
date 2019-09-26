import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, Platform, ToastController, LoadingController, App, ViewController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { NoteProvider } from '../../providers/note/note';
import { FolderProvider } from '../../providers/folder/folder';

import { addnoteOptions } from '../../interfaces/user-options';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';

import { DetailPage } from '../detail/detail';

declare var cordova: any;

/**
 * Generated class for the AddnotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addnote',
  templateUrl: 'addnote.html',
})
export class AddnotePage {

  lastImage: string = null;
  id_folder: any;
  foldername: any;
  radioFolder: any;
  radioLabel: any;
  radioValue: any;
  submitted = false;
  submittedAlbum = false;
  hideAlbum = true;

  addnote: addnoteOptions = {
    title: '',
    note: ''
  };

  public photos: any;
  public imageList: any;
  public base64Image: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private alertCtrl: AlertController,
    public platform: Platform,
    public filePath: FilePath,
    private file: File,
    public toastCtrl: ToastController,
    private base64ToGallery: Base64ToGallery,
    public loadingCtrl: LoadingController,
    public noteData: NoteProvider,
    public folderData: FolderProvider,
    public viewCtrl: ViewController,
    public appCtrl: App
  ) {
    this.photos = [];
    if (navParams.get('base64') != null) {
      this.photos.push(navParams.get('base64'));
    }
    this.imageList = [];
    if (navParams.get('images') != null) {
      this.imageList.push(navParams.get('images'));
    }
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AddnotePage');
  }

  submit(form: NgForm) {
    this.submitted = true;

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait..'
    });

    if (form.valid) {
      loading.present();
      this.noteData.create(this.addnote.title, this.addnote.note, this.radioValue)
        .then(sukses => {
          console.log(sukses);
          if (this.imageList.length > 0) {
            for (var i = 0; i < this.imageList.length; i++) {
              this.saveImage(this.imageList[i], sukses[0].title, sukses[0].id);
            }
            this.viewCtrl.dismiss();
            this.navCtrl.setRoot(DetailPage, {
              id_note: sukses[0].id,
              judul: sukses[0].title,
              folder: this.radioLabel,
              id_folder: this.radioValue
            })
              .then(() => {
                loading.dismiss();
              });
          } else {
            this.viewCtrl.dismiss();
            this.navCtrl.setRoot(DetailPage, {
              id_note: sukses[0].id,
              judul: sukses[0].title,
              folder: this.radioLabel,
              id_folder: this.radioValue
            })
              .then(() => {
                loading.dismiss();
              });
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  cancel() {
    this.navCtrl.pop();
  }

  private createFileName(title, id_note) {
    var d = new Date(),
      n = d.getTime(),
      newFileName = "Notegram-" + this.foldername + "-" + title + id_note + n + ".jpg";
    return newFileName;
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
      this.photos.push(this.base64Image);
      this.imageList.push(imageData);
      this.photos.reverse();
    }, (err) => {
      this.presentToast('Error while selecting image.');
      console.log(err);
    });
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Sure you want to delete this photo?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.photos.splice(index, 1);
            this.imageList.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  saveImage(image, title, id_note) {
    var base64Blob = this.base64toBlob(image, 'image/jpeg');
    this.file.writeFile(this.file.externalDataDirectory, this.createFileName(title, id_note), base64Blob, true)
      .then(success => {
        this.noteData.insertImage(success.name, success.nativeURL, id_note)
          .then(data => {
            this.presentToast('Image saved to ' + success.nativeURL);
          })
          .catch(err => {
            this.presentToast('Error saving image to gallery ' + err);
          });
      })
      .catch(e => {
        console.log(e);
      });
  }

  showRadio() {
    this.radioFolder = this.folderData.getFolderList();
    if (this.radioFolder.length > 0) {
      let checked = false;
      let alert = this.alertCtrl.create();
      alert.setTitle('Choose Album');

      for (var i = 0; i < this.radioFolder.length; i++) {
        if(this.radioValue == this.radioFolder[i].id){
          checked = true;
        } else {
          checked = false;
        }
        let radio = {
          type: 'radio',
          label: this.radioFolder[i].foldername,
          value: this.radioFolder[i].id,
          checked: checked
        };
        alert.addInput(radio);
      }
      alert.addButton({
        text: 'Create New Folder',
        handler: () => {
          this.createNewFolder();
        }
      });
      alert.addButton('Cancel');
      alert.addButton({
        text: 'OK',
        handler: data => {
          console.log(data);
          this.radioValue = data;
          this.folderData.getFolderById(data)
          .then(result => {
            this.radioLabel =  result[0].foldername;
            console.log(this.radioLabel);
          })
          .catch( e => {
            console.log(e);
          });
        }
      });
      alert.present();
    } else {
      let prompt = this.alertCtrl.create({
        title: 'Create New Folder',
        inputs: [
          {
            id: 'folder',
            name: 'folder',
            placeholder: 'Folder Name'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Create',
            handler: data => {
              this.folderData.create(data.folder)
                .then(folder => {
                  if (folder === false) {
                    let alert = this.alertCtrl.create({
                      title: 'ERROR !',
                      subTitle: 'Create folder failed !',
                      buttons: ['OK']
                    });
                    alert.present();
                  } else {
                    this.id_folder = folder;
                    this.radioValue = folder;
                    this.radioLabel = data.folder;
                    let alert = this.alertCtrl.create({
                      title: 'SUCCESS !',
                      subTitle: 'Create folder success !',
                      buttons: ['OK']
                    });
                    alert.present();
                  }
                })
            }
          }
        ]
      });
      prompt.present();
    }

  }

  createNewFolder(){
    let prompt = this.alertCtrl.create({
      title: 'Create New Folder',
      inputs: [
        {
          id: 'folder',
          name: 'folder',
          placeholder: 'Folder Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Create',
          handler: data => {
            this.folderData.create(data.folder)
              .then(folder => {
                if (folder === false) {
                  let alert = this.alertCtrl.create({
                    title: 'ERROR !',
                    subTitle: 'Create folder failed !',
                    buttons: ['OK']
                  });
                  alert.present();
                } else {
                  this.id_folder = folder;
                  this.radioValue = folder;
                  this.radioLabel = data.folder;
                  let alert = this.alertCtrl.create({
                    title: 'SUCCESS !',
                    subTitle: 'Create folder success !',
                    buttons: ['OK']
                  });
                  alert.present();
                }
              })
          }
        }
      ]
    });
    prompt.present();
  }

}
