import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';

import {SqlProvider} from "../sql/sql";
import { Item } from '../../models/item';

/*
  Generated class for the FolderProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FolderProvider {

  items: Item[] = [];
  single: any;
  itemresult: any;

  constructor(
    public sql: SqlProvider,
    public http: Http,
    public platform: Platform
  ) {
    this.getFolders();
  }

  create(foldername: Item){
    return this.sql.query('CREATE TABLE IF NOT EXISTS folder(id INTEGER PRIMARY KEY AUTOINCREMENT, foldername VARCHAR(255))')
    .then( () => {
      return this.sql.query('INSERT INTO folder(foldername) VALUES(?)', [foldername])
      .then( data =>  {
        let input = new Item({
          id: data.res.insertId,
          foldername: foldername
        });
        return this.items.push(input.fields);
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

  update(id:number, foldername: Item){
    return this.sql.query('CREATE TABLE IF NOT EXISTS folder(id INTEGER PRIMARY KEY AUTOINCREMENT, foldername VARCHAR(255))')
    .then( () => {
      return this.sql.query('UPDATE folder SET foldername = ? WHERE id = ?', [foldername,id])
      .then( () =>  {
        this.items = [];
        this.getFolders();
        return this.items = this.getFolderList();
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

  delete(id:number){
    return this.sql.query('CREATE TABLE IF NOT EXISTS folder(id INTEGER PRIMARY KEY AUTOINCREMENT, foldername VARCHAR(255))')
    .then( () => {
      return this.sql.query('DELETE FROM folder WHERE id = ?', [id])
      .then( () =>  {
        this.items = [];
        this.getFolders();
        return this.items = this.getFolderList();
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

  createTable(){
    return this.sql.query('CREATE TABLE IF NOT EXISTS folder(id INTEGER PRIMARY KEY AUTOINCREMENT, foldername VARCHAR(255))').
    then( () => {
      console.log("Table folder created");
    })
    .catch( e => console.log(e));
  }

  getFolders(): Promise<any[]>{
    return this.sql.query('CREATE TABLE IF NOT EXISTS folder(id INTEGER PRIMARY KEY AUTOINCREMENT, foldername VARCHAR(255))')
    .then( () => {
      return this.sql.query('SELECT * FROM folder')
      .then( data =>  {
        if(data.res.rows.length > 0){
          for(var i=0; i < data.res.rows.length; i++){
              this.items.push(data.res.rows.item(i));
          }
          return this.items;
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

  getFolderById(id: number){
    return this.sql.query('CREATE TABLE IF NOT EXISTS folder(id INTEGER PRIMARY KEY AUTOINCREMENT, foldername VARCHAR(255))')
    .then( () => {
      return this.sql.query('SELECT * FROM folder where id = ?',[id])
      .then( data =>  {
        this.single = [];
        if(data.res.rows.length > 0){
          // if(this.platform.is('core')){
          //   for(var i=0; i< data.res.rows.length; i++){
          //       this.single.push(data.res.rows[i]);
          //   }
          // } else {
          //   for(var i=0; i< data.res.rows.length; i++){
          //       this.single.push(data.res.rows._array[i]);
          //   }
          // }
          for(var i=0; i < data.res.rows.length; i++){
              this.single.push(data.res.rows.item(i));
          }
          this.single = this.getSingleList();
          return this.single;
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

  search(keyword: string){
    return this.sql.query('CREATE TABLE IF NOT EXISTS folder(id INTEGER PRIMARY KEY AUTOINCREMENT, foldername VARCHAR(255))')
    .then( () => {
      return this.sql.query('SELECT * FROM folder where foldername like ?',["%"+keyword+"%"])
      .then( data =>  {
        this.itemresult = [];
        if(data.res.rows.length > 0){
          if(this.platform.is('core')){
            for(var i=0; i< data.res.rows.length; i++){
                this.itemresult.push(data.res.rows[i]);
            }
          } else {
            for(var i=0; i< data.res.rows.length; i++){
                this.itemresult.push(data.res.rows._array[i]);
            }
          }
          return this.itemresult;
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

  getFolderList(){
    return this.items;
  }

  getSingleList(){
    return this.single;
  }

  getSearchList(){
    return this.itemresult;
  }

}
