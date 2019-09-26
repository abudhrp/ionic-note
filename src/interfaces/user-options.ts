export interface registerOptions {
  username: string,
  email   : string,
  password: string,
  confirm : string
}

export interface loginOptions {
  username: string,
  password: string
}

export interface addnoteOptions {
  title : string,
  note  : string
}
