import React, { useEffect, useState } from 'react';
import { EscapeRoomModel, Province } from './EscapeRoom.Model';
import { EscapeRoomService } from './EscapeRoom.Service';
import { AuthService } from '../../auth/AuthService';
import { User } from '../../users/UserModel';
import EscapeRoomForm from './EscapeRoom.Form';
import { useNavigate } from 'react-router-dom';


const EscapeRoomCreate: React.FC = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUser: User = AuthService.getCurrentUser();
  const nav = useNavigate();

  // Datos iniciales para creación
  const initialData: EscapeRoomModel = {
    id: 0,
    name: '',
    description: '',
    address: '',
    province: 0,
    owner: currentUser.id
  };

  useEffect(() => {
    getProvinces();
  }, []);

  const getProvinces = async () => {
    try {
      const res = await EscapeRoomService.getProvinces();
      setProvinces(res.data);
    } catch (err: any) {
      const errMessage = err?.message || 'Error cargando provincias';
      setError(errMessage);
    }
  };

  const handleSubmit = async (data: EscapeRoomModel) => {
    setLoading(true);
    setError(null);

    try {
      const res = await EscapeRoomService.create(data);

      if (res.success) {
        nav('/owner/dashboard', {
          state: { 
            alert: {
              type: 'success',
              message: res.message
            }
          }
        });
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
    nav('/owner/dashboard', {
      state: { 
        message: 'Operación cancelada',
        type: 'info'
      }
    });
  };

  return (
    <EscapeRoomForm
      initialData={initialData}
      provinces={provinces}
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