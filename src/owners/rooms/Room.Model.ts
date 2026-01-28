export interface RoomModel {
    id: number,
    name: string,
    description: string,
    duration: number,
    price: number,
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