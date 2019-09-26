import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditnotePage } from './editnote';

@NgModule({
  declarations: [
    EditnotePage,
  ],
  imports: [
    IonicPageModule.forChild(EditnotePage),
  ],
})
export class EditnotePageModule {}
