
export interface EscapeRoomModel {
  id: number,
  name: string,
  owner: number,
  address: string,
  postal_code: string,
  cif: string,
  email: string,
  phone: string
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

export interface CreateFormProp {
  onCancel: () => void;
}

export interface UpdateFormProp {
  id?: number,
  onCancel: () => void;
}