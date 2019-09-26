import { Component } from '@angular/core';
import { NavController, ViewController, MenuController, AlertController } from 'ionic-angular';

import { FolderProvider } from '../../providers/folder/folder';
import { Item } from '../../models/item';

import { NotePage } from '../note/note';

@Component({
  selector: 'page-myfolder',
  templateUrl: 'myfolder.html',
})
export class MyfolderPage {

  currentItems: Item[];
  visible = false;

  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    private menu: MenuController,
    public alertCtrl: AlertController,
    public folderData: FolderProvider
  ) {
    this.currentItems = this.folderData.getFolderList();
  }

  ionViewWillEnter() {
    this.menu.enable(true);
    this.viewCtrl.showBackButton(false);
  }

  search() {
    this.visible = !this.visible;
  }

  newfolder() {
    let alert = this.alertCtrl.create({
      title: 'Create Folder',
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
              .then(data => {
                if (data === false) {
                  let alert = this.alertCtrl.create({
                    title: 'ERROR !',
                    subTitle: 'Create folder failed !',
                    buttons: ['OK']
                  });
                  alert.present();
                } else {
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
    alert.present();
  }

  editdata(id) {
    this.folderData.getFolderById(id)
      .then(result => {
        let alert = this.alertCtrl.create({
          title: 'Edit Folder',
          inputs: [
            {
              id: 'folder',
              name: 'folder',
              placeholder: 'Folder Name',
              value: result[0].foldername
            }
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Edit',
              handler: data => {
                // console.log(data);
                this.folderData.update(id, data.folder)
                  .then(data => {
                    if (data === false) {
                      let alert = this.alertCtrl.create({
                        title: 'ERROR !',
                        subTitle: 'Edit folder failed !',
                        buttons: ['OK']
                      });
                      alert.present();
                    } else {
                      this.currentItems = this.folderData.getFolderList();
                      let alert = this.alertCtrl.create({
                        title: 'SUCCESS !',
                        subTitle: 'Edit folder success !',
                        buttons: ['OK']
                      });
                      alert.present();
                    }
                  })
              }
            }
          ]
        });
        alert.present();
      });
  }

  deletedata(id) {
    this.folderData.getFolderById(id)
      .then(result => {
        let alert = this.alertCtrl.create({
          title: 'Confirm delete',
          message: 'Do you want to delete this folder?',
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
                this.folderData.delete(id)
                  .then( () => {
                    this.currentItems = this.folderData.getFolderList();
                    let alert = this.alertCtrl.create({
                      title: 'SUCCESS !',
                      subTitle: 'Delete folder success !',
                      buttons: ['OK']
                    });
                    alert.present();
                  })
              }
            }
          ]
        });
        alert.present();
      });
  }

  onSearch(keyword: any) {
    if (keyword.data != null) {
      this.folderData.search(keyword.target.value)
        .then(data => {
          this.currentItems = this.folderData.getSearchList();
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      this.currentItems = this.folderData.getFolderList();
    }
  }

  openItem(item: Item, id) {
    this.navCtrl.push(NotePage, {
      id: id,
      item: item
    });
  }

  doRefresh(refresher) {
    this.currentItems = this.folderData.getFolderList();
    setTimeout(() => {
      refresher.complete();
    }, 3000);
  }

}
