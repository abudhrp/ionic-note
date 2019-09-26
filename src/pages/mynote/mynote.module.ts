import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MynotePage } from './mynote';

@NgModule({
  declarations: [
    MynotePage,
  ],
  imports: [
    IonicPageModule.forChild(MynotePage),
  ],
})
export class MynotePageModule {}
