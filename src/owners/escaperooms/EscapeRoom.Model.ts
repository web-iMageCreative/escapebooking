
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

export interface EscapeRoomFormError {
  name: { success: boolean, message:string },
  address: { success: boolean, message:string },
  postal_code: { success: boolean, message:string },
  cif: { success: boolean, message:string },
  email: { success: boolean, message:string },
  phone: { success: boolean, message:string },
}