import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { MyApp } from './app.component';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgotPage } from '../pages/forgot/forgot';
import { HomePage } from '../pages/home/home';
import { NotePage } from '../pages/note/note';
import { AddnotePage } from '../pages/addnote/addnote';
import { DetailPage } from '../pages/detail/detail';
import { ImagePage } from '../pages/image/image';
import { EditnotePage } from '../pages/editnote/editnote';
import { MynotePage } from '../pages/mynote/mynote';
import { MyfolderPage } from '../pages/myfolder/myfolder';

import { UserProvider } from '../providers/user/user';
import { SqlProvider } from '../providers/sql/sql';
import { FolderProvider } from '../providers/folder/folder';
import { HttpModule } from '@angular/http';
import { NoteProvider } from '../providers/note/note';

@NgModule({
  declarations: [
    MyApp,
    TutorialPage,
    WelcomePage,
    LoginPage,
    RegisterPage,
    ForgotPage,
    HomePage,
    NotePage,
    AddnotePage,
    DetailPage,
    ImagePage,
    EditnotePage,
    MynotePage,
    MyfolderPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: MyfolderPage, name: 'MyfolderPage', segment: 'myfolder' },
        { component: MynotePage, name: 'MynotePage', segment: 'mynote' },
      ]
    }),
    IonicStorageModule.forRoot({
        name: 'session.db'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TutorialPage,
    WelcomePage,
    LoginPage,
    RegisterPage,
    ForgotPage,
    HomePage,
    NotePage,
    AddnotePage,
    DetailPage,
    ImagePage,
    EditnotePage,
    MynotePage,
    MyfolderPage
  ],
  providers: [
    Camera,
    Base64ToGallery,
    File,
    FilePath,
    SQLite,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    SqlProvider,
    FolderProvider,
    NoteProvider,
    PhotoViewer
  ]
})
export class AppModule {}
