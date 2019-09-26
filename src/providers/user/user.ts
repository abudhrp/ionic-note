import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';

import { md5 } from '../../app/md5';
import { Storage } from '@ionic/storage';
import {SqlProvider} from "../sql/sql";

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserProvider {

  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  check = false;

  constructor(
    public sql: SqlProvider,
    public storage: Storage,
    public platform: Platform
  ) {}

  initializeDb(): any{
    this.sql.query('CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(50), email VARCHAR(100), password VARCHAR(255))')
    .then( () => console.log('Table user created'))
    .catch( e => console.log(e));
  }

  register(username: string, email: string, password: string): Promise<boolean> {
    return this.sql.query('CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(50), email VARCHAR(100), password VARCHAR(255))').
    then( () => {
      return this.sql.query('INSERT INTO user(username,email,password) VALUES(?,?,?)', [username, email, md5(password)])
      .then( () =>  {
        return true;
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
  };

  login(username: string, password: string): Promise<boolean> {
    return this.sql.query('CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(50), email VARCHAR(100), password VARCHAR(255))')
    .then( () => {
      return this.sql.query('SELECT * FROM user where username = ? and password = ?', [username, md5(password)])
      .then( data => {
          var length = data.res.rows.length;
          if (length > 0) {
              if(this.platform.is('core')){
                var hasil = data.res.rows[0];
              } else {
                var hasil = data.res.rows._array[0];
              }
              this.setUsername(hasil.username);
              console.log(hasil.username);
              return true;
          } else {
            return false;
          }
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
  };

  setUsername(username: string): void {
    this.storage.set('username', username);
    this.storage.set(this.HAS_LOGGED_IN, true);
  };

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
  };

  setHasSeenTutorial(){
    this.storage.set(this.HAS_SEEN_TUTORIAL, true);
  }

  setNotSeenTutorial(){
    this.storage.remove(this.HAS_SEEN_TUTORIAL);
  }

  hasSeenTutorial(): Promise<boolean> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL)
    .then((value) => {
      return value === true;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN)
    .then((value) => {
      return value === true;
    });
  };

}
