export interface EscapeRoomModel {
  id: number,
  name: string,
  description: string,
  address: string,
  province: number,
  owner: number
}

export interface Province {
  id:number,
  code:string,
  name:string
}