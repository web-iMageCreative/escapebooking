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

export interface EscapeRoomFormProps {
  initialData: EscapeRoomModel;
  provinces: Province[];
  loading: boolean;
  error: string | null;
  onSubmit: (data: EscapeRoomModel) => void;
  onCancel: () => void;
  title?: string;
  submitText?: string;
  cancelText?: string;
}