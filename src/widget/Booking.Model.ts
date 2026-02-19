export interface BookingModel {
  id: number,
  name: string,
  email: string,
  phone: number,
  num_players: number,
  date: Date,
  id_room: number
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