export interface BookingModel {
  id: number,
  name: string,
  email: string,
  phone: number,
  num_players: number,
  date: Date,
  price: number | string,
  id_room: number
  room_name?: string
}

export interface BookingFormProps {
  initialData: BookingModel;
  loading: boolean;
  error: string | null;
  onSubmit: (data: BookingModel) => void;
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

export interface BookingFormError {
  name: { success: boolean, message:string },
  email: { success: boolean, message:string },
  phone: { success: boolean, message:string }
}