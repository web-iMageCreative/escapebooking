export interface RoomModel {
    id: number,
    name: string,
    duration: number,
    schedule: Schedule[],
    min_players: number,
    max_players: number,
    prices: Price[],
    escaperoom_id: number
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
  price: number
}

export interface Schedule {
  id_room: number,
  day_week: number,
  hour: Date,
  strHour: string
}