import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyfolderPage } from './myfolder';

@NgModule({
  declarations: [
    MyfolderPage,
  ],
  imports: [
    IonicPageModule.forChild(MyfolderPage),
  ],
})
export class MyfolderPageModule {}
