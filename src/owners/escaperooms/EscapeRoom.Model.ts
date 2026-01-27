import { Province } from "../../shared/models/province.Model";

export interface EscapeRoomModel {
  id: number,
  name: string,
  description: string,
  address: string,
  province: number,
  owner: number
}

export interface EscapeRoomFormProps {
  initialData: EscapeRoomModel;
  loading: boolean;
  error: string | null;
  onSubmit: (data: EscapeRoomModel) => void;
  onCancel: () => void;
  title?: string;
  submitText?: string;
  cancelText?: string;
}