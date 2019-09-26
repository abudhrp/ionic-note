import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';

import {SqlProvider} from "../sql/sql";

/*
  Generated class for the NoteProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class NoteProvider {

  noteItem = [];
  photos = [];
  allNote = [];
  noteList: any;
  singleNote: any;
  imageList: any;
  id_folder: any;

  constructor(
    public http: Http,
    public sql: SqlProvider,
    public platform: Platform
  ) {
    this.getNoteList();
    this.getImageList();
    this.getNoteByIdNote();
    this.getAllNotes();
  }

  create(title: string, note: string, id_folder: number){
    return this.sql.query('CREATE TABLE IF NOT EXISTS note(id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255), note TEXT, id_folder INTEGER, timecreated TEXT)')
    .then( () => {
      var date = new Date().toLocaleString();
      return this.sql.query('INSERT INTO note(title, note, id_folder, timecreated) VALUES(?,?,?,?)', [title, note, id_folder, date])
      .then( data =>  {
        let input = ({
          id: data.res.insertId,
          title: title,
          note: note,
          id_folder: id_folder
        });
        this.noteItem.push(input);
        return this.noteItem;
      })
      .catch( e => {
        console.log(e);
        return false;
      });
    })
    .catch( e => {
      console.log(e);
      return false;
    });
  }

  update(id_note: number, title: string, note: string, id_folder: number){
    return this.sql.query('CREATE TABLE IF NOT EXISTS note(id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255), note TEXT, id_folder INTEGER, timecreated TEXT)')
    .then( () => {
      return this.sql.query('UPDATE note SET title=?,note=? WHERE id=?', [title, note, id_note])
      .then( data =>  {
        console.log(data);
        this.noteList = [];
        this.allNote = [];
        this.getAllNotes();
        this.getNotes(id_folder);
        this.allNote = this.getAllNote();
        return this.noteList = this.getNoteList();
      })
      .catch( e => {
        console.log(e);
        return false;
      });
    })
    .catch( e => {
      console.log(e);
      return false;
    });
  }

  delete(id_note: number, id_folder: number){
    return this.sql.query('CREATE TABLE IF NOT EXISTS note(id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255), note TEXT, id_folder INTEGER, timecreated TEXT)')
    .then( () => {
      return this.sql.query('DELETE FROM note WHERE id = ?', [id_note])
      .then( () =>  {
        this.noteList = [];
        this.allNote = [];
        this.deleteImageByIdNote(id_note);
        this.getAllNotes();
        this.getNotes(id_folder);
        this.allNote = this.getAllNote();
        return this.noteList = this.getNoteList();
      })
      .catch( e => {
        console.log(e);
        return false;
      });
    })
    .catch( e => {
      console.log(e);
      return false;
    });
  }

  getAllNotes(): Promise<any[]>{
    return this.sql.query('CREATE TABLE IF NOT EXISTS note(id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255), note TEXT, id_folder INTEGER, timecreated TEXT)')
    .then( () => {
      return this.sql.query('SELECT *,note.id as id_note FROM note left join folder on folder.id = note.id_folder ORDER BY note.timecreated desc')
      .then( data =>  {
        this.allNote = [];
        if(data.res.rows.length > 0){
          // if(this.platform.is('core')){
          //   for(var i=0; i< data.res.rows.length; i++){
          //       this.allNote.push(data.res.rows[i]);
          //   }
          // } else {
          //   for(var i=0; i< data.res.rows.length; i++){
          //       this.allNote.push(data.res.rows._array[i]);
          //   }
          // }
          for(var i=0; i< data.res.rows.length; i++){
              this.allNote.push(data.res.rows.item(i));
          }
          this.allNote = this.getAllNote();
          return this.allNote;
        }
      })
      .catch( e => {
        console.log(e);
      });
    })
    .catch( e => {
      console.log(e);
    });
  }

  getNotes(id_folder: number){
    return this.sql.query('CREATE TABLE IF NOT EXISTS note(id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255), note TEXT, id_folder INTEGER, timecreated TEXT)')
    .then( () => {
      return this.sql.query('SELECT * FROM note where id_folder = ?', [id_folder])
      .then( data =>  {
        this.noteList = [];
        if(data.res.rows.length > 0){
          if(this.platform.is('core')){
            for(var i=0; i< data.res.rows.length; i++){
                this.noteList.push(data.res.rows[i]);
            }
          } else {
            for(var i=0; i< data.res.rows.length; i++){
                this.noteList.push(data.res.rows._array[i]);
            }
          }
          this.noteList = this.getNoteList();
          return this.noteList;
        }
      })
      .catch( e => {
        console.log(e);
      });
    })
    .catch( e => {
      console.log(e);
    });
  }

  search(searchTerm){
    return this.noteList.filter((item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  searchAll(searchTerm){
    return this.allNote.filter((item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  getNoteById(id_note: number){
    return this.sql.query('CREATE TABLE IF NOT EXISTS note(id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255), note TEXT, id_folder INTEGER, timecreated TEXT)')
    .then( () => {
      return this.sql.query('SELECT * FROM note where id = ?', [id_note])
      .then( data =>  {
        this.singleNote = [];
        if(data.res.rows.length > 0){
          // if(this.platform.is('core')){
          //   for(var i=0; i< data.res.rows.length; i++){
          //       this.singleNote.push(data.res.rows[i]);
          //   }
          // } else {
          //   for(var i=0; i< data.res.rows.length; i++){
          //       this.singleNote.push(data.res.rows._array[i]);
          //   }
          // }
          for(var i=0; i< data.res.rows.length; i++){
              this.singleNote.push(data.res.rows.item(i));
          }
          this.singleNote = this.getNoteByIdNote();
          return this.singleNote;
        }
      })
      .catch( e => {
        console.log(e);
      });
    })
    .catch( e => {
      console.log(e);
    });
  }

  insertImage(imageName: string, imageUrl: string, id_note: number){
    return this.sql.query('CREATE TABLE IF NOT EXISTS notephotos(id INTEGER PRIMARY KEY AUTOINCREMENT, imageName VARCHAR(255), imageUrl VARCHAR(255), id_note INTEGER)')
    .then( () => {
      return this.sql.query('INSERT INTO notephotos(imageName, imageUrl, id_note) VALUES(?,?,?)', [imageName, imageUrl, id_note])
      .then( data =>  {
        let input = ({
          id      : data.res.insertId,
          name    : imageName,
          url     : imageUrl,
          note_id : id_note
        });
        this.photos.push(input);
        return this.photos;
      })
      .catch( e => {
        console.log(e);
        return false;
      });
    })
    .catch( e => {
      console.log(e);
      return false;
    });
  }

  deleteImage(id_gambar: number, id_note: number){
    return this.sql.query('CREATE TABLE IF NOT EXISTS notephotos(id INTEGER PRIMARY KEY AUTOINCREMENT, imageName VARCHAR(255), imageUrl VARCHAR(255), id_note INTEGER)')
    .then( () => {
      return this.sql.query('DELETE FROM notephotos WHERE id = ?', [id_gambar])
      .then( () =>  {
        this.imageList = [];
        this.getImages(id_note);
        this.imageList = this.getImageList();
        console.log(this.imageList);
        return this.imageList;
      })
      .catch( e => {
        console.log(e);
        return false;
      });
    })
    .catch( e => {
      console.log(e);
      return false;
    });
  }

  deleteImageByIdNote(id_note: number){
    return this.sql.query('CREATE TABLE IF NOT EXISTS notephotos(id INTEGER PRIMARY KEY AUTOINCREMENT, imageName VARCHAR(255), imageUrl VARCHAR(255), id_note INTEGER)')
    .then( () => {
      return this.sql.query('DELETE FROM notephotos WHERE id_note = ?', [id_note])
      .then( () =>  {
        this.imageList = [];
        this.getImages(id_note);
        this.imageList = this.getImageList();
        console.log(this.imageList);
        return this.imageList;
      })
      .catch( e => {
        console.log(e);
        return false;
      });
    })
    .catch( e => {
      console.log(e);
      return false;
    });
  }

  getImages(id_note: number){
    return this.sql.query('CREATE TABLE IF NOT EXISTS notephotos(id INTEGER PRIMARY KEY AUTOINCREMENT, imageName VARCHAR(255), imageUrl VARCHAR(255), id_note INTEGER)')
    .then( () => {
      return this.sql.query('SELECT * FROM notephotos where id_note = ?', [id_note])
      .then( data =>  {
        this.imageList = [];
        if(data.res.rows.length > 0){
          if(this.platform.is('core')){
            for(var i=0; i< data.res.rows.length; i++){
                this.imageList.push(data.res.rows[i]);
            }
          } else {
            for(var i=0; i< data.res.rows.length; i++){
                this.imageList.push(data.res.rows._array[i]);
            }
          }
          this.imageList = this.getImageList();
          return this.imageList;
        }
      })
      .catch( e => {
        console.log(e);
      });
    })
    .catch( e => {
      console.log(e);
    });
  }

  getAllNote(){
    this.getAllNotes();
    return this.allNote;
  }
  getNoteList(){
    return this.noteList;
  }

  getNoteByIdNote(){
    return this.singleNote;
  }

  getImageList(){
    return this.imageList;
  }

}
