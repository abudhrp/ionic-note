import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { addnoteOptions } from '../../interfaces/user-options';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { NoteProvider } from '../../providers/note/note';
import { NotePage } from '../note/note';

/**
 * Generated class for the EditnotePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editnote',
  templateUrl: 'editnote.html',
})
export class EditnotePage {

  id_note   : any;
  id_folder : any;
  foldername: any;
  judul     : any;
  images    : any;
  id_gambar : any;
  folder    : any;
  isinote   : any;
  note      : any;
  submitted = false;
  photos = [];

  editnote: addnoteOptions = {
    title: '',
    note: ''
  };

  public imageList: any;
  public base64Image: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private file: File,
    public noteData: NoteProvider
  ) {
    this.id_note  = navParams.get('id_note');
    this.id_folder= navParams.get('id_folder');
    this.foldername= navParams.get('folder');
    this.judul    = navParams.get('judul');
    this.folder   = navParams.get('folder');
    this.images   = navParams.get('images');
    this.id_gambar= navParams.get('id_gambar');
    this.isinote  = navParams.get('isinote');

    this.editnote.title = this.judul;
    this.editnote.note = this.isinote;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditnotePage');
  }

  ngOnInit() {
    this.imageList = [];
    for(var i=0; i < this.images.length; i++){
      this.photos.push(this.images[i]);
    }
  }

  submit(form: NgForm) {
    this.submitted = true;

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait..'
    });

    if (form.valid) {
      loading.present();
      this.noteData.update(this.id_note, this.editnote.title, this.editnote.note, this.id_folder)
      .then( data => {
        if(this.imageList.length > 0){
          for(var i = 0; i < this.imageList.length; i++){
            this.saveImage(this.imageList[i],this.editnote.title,this.id_note);
          }
          this.viewCtrl.dismiss();
          this.navCtrl.setRoot(NotePage, {
            id: this.id_folder,
            item: this.foldername
          })
          .then(()=>{
            loading.dismiss();
          });
        } else {
          this.viewCtrl.dismiss();
          this.navCtrl.push(NotePage, {
            id: this.id_folder,
            item: this.foldername
          })
          .then(()=>{
            loading.dismiss();
          });
        }
      })
      .catch( e => {
        console.log(e);
      });
    }
  }

  cancel() {
    this.navCtrl.pop();
  }

  private createFileName(title,id_note) {
    var d = new Date(),
    n = d.getTime(),
    newFileName = "Notegram-"+ this.foldername + "-" + title + id_note + n +".jpg";
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
      this.images.push(this.base64Image);
      this.imageList.push(imageData);
    }, (err) => {
      this.presentToast('Error while selecting image.');
      console.log(err);
    });
  }

  deletePhoto(index, id_gambar, id_note) {
    console.log(index);
    console.log(id_gambar);
    console.log(this.images);
    console.log(this.imageList);
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
            this.images.splice(index, 1);
            if(id_gambar != 0){
              this.noteData.deleteImage(id_gambar, id_note)
              .then( hasil => {
                console.log(hasil);
              });
            } else {
              var jumlah = this.images.length;
              this.imageList.splice((jumlah-index), 1);
            }
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
      for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  saveImage(image,title,id_note){
    var base64Blob = this.base64toBlob(image, 'image/jpeg');
    this.file.writeFile(this.file.externalDataDirectory, this.createFileName(title,id_note), base64Blob, true)
    .then( success => {
      this.noteData.insertImage(success.name, success.nativeURL, id_note)
      .then( data => {
        this.photos.push(success.nativeURL);
        this.presentToast('Image saved to '+ success.nativeURL);
      })
      .catch( err => {
        this.presentToast('Error saving image to gallery '+ err);
      });
    })
    .catch( e => {
      console.log(e);
    });
  }

}
