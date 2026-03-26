import React, { useState } from 'react';
import { EscapeRoomModel, CreateFormProp } from '../EscapeRoom.Model';
import { EscapeRoomService } from '../EscapeRoom.Service';
import { AuthService } from '../../../auth/AuthService';
import { User } from '../../../users/UserModel';
import EscapeRoomForm from './EscapeRoom.Form';


const EscapeRoomCreate: React.FC<CreateFormProp> = ({onCancel, onSuccess}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUser: User = AuthService.getCurrentUser();

  // Datos iniciales para creación
  const initialData: EscapeRoomModel = {
    id: 0,
    name: '',
    owner: currentUser.id,
    address: '',
    postal_code: '',
    cif: '',
    email: '',
    phone: ''
  };

  const handleSubmit = async (data: EscapeRoomModel) => {
    setLoading(true);
    setError(null);

    try {
      const res = await EscapeRoomService.create(data);

      if (res.success) {
        onSuccess();
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <EscapeRoomForm
      initialData={initialData}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      title="Nuevo Escape Room"
      submitText="Crear Escape Room"
      cancelText="Cancelar"
    />
  );
};

export default EscapeRoomCreate;