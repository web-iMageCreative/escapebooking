export interface RoomModel {
    id: number,
    name: string,
    duration: number,
    schedule: Schedule[],
    min_players: number,
    max_players: number,
    prices: Price[],
    escaperoom_id: number,
    notes?: string
}

export interface RoomFormProps {
  initialData: RoomModel;
  loading: boolean;
  error: string | null;
  onSubmit: (data: RoomModel) => void;
  onCancel: () => void;
  title?: string;
  submitText?: string;
  cancelText?: string;
}

export interface Price {
  id_room: number,
  num_players: number,
  price: number | string
}

export interface Schedule {
  id_room: number,
  day_week: number,
  hour: Date,
  strHour: string
}

export interface RoomFormError {
  name: { success: boolean, message:string },
  duration: { success: boolean, message:string },
  schedules: { success: boolean, message:string },
  day: { success: boolean, message:string },
  hour: { success: boolean, message:string },
  min_players: { success: boolean, message:string },
  max_players: { success: boolean, message:string },
  prices: { success: boolean, message:string }[]
}

export interface RoomHolidaysFormError {
  name:    { success: boolean, message:string },
  dateIni: { success: boolean, message:string },
  dateEnd: { success: boolean, message:string }
}

export interface RoomHolidaysModel {
  id: number,
  name: string,
  date_ini: string,
  date_end: string,
  room_id: number
}