import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { UserProvider } from '../providers/user/user';
import { NoteProvider } from '../providers/note/note';
import { FolderProvider } from '../providers/folder/folder';

import { TutorialPage } from '../pages/tutorial/tutorial';
import { HomePage } from '../pages/home/home';
import { MynotePage } from '../pages/mynote/mynote';
import { MyfolderPage } from '../pages/myfolder/myfolder';
import { WelcomePage } from '../pages/welcome/welcome';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  appPages: PageInterface[] = [];

  rootPage:any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public userData: UserProvider,
    public storage: Storage,
    public noteData: NoteProvider,
    public folderData: FolderProvider
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.storage.get(this.userData.HAS_SEEN_TUTORIAL).then((value) => {
      if(value === true){
        this.rootPage = HomePage;
      } else {
        this.rootPage = TutorialPage;
      }
    });

    this.appPages = [
      { title: 'My Folder', name: 'MyfolderPage', component: MyfolderPage, icon: 'ios-folder-open-outline' },
      { title: 'My Notes', name: 'MynotePage', component: MynotePage, icon: 'ios-paper-outline' }
    ]

    // this.updateJumlah();

  }

  // updateJumlah(){
  //   this.folderData.createTable()
  //   .then( () => {
  //     this.noteData.getAllNotes()
  //     .then( notes => {
  //       if(notes.length > 0){
  //         this.appPages[1].title = this.appPages[1].title + " ("+notes.length+")";
  //       }
  //     })
  //     .catch( e => console.log(e));
  //   })
  //   .catch( e => console.log(e));
  // }

  openTutorial() {
    this.userData.setNotSeenTutorial();
    this.nav.setRoot(TutorialPage);
  }

  openPage(page: PageInterface) {
    this.nav.setRoot(page.name);
  }

  logout(){
    this.userData.logout();
    this.nav.setRoot(WelcomePage);
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.component) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }
}
