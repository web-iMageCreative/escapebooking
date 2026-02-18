import React, { useState } from 'react';
import { RoomModel } from '../Room.Model';
import { RoomService } from '../Room.Service';
import RoomForm from './Room.Form';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const RoomCreate: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const { escaperoom_id } = useParams<{ escaperoom_id: string }>();

  const initialData: RoomModel = {
    id: 0,
    name: '',
    duration: 0,
    schedule: [],
    min_players: 0,
    max_players: 0,
    prices: [],
    escaperoom_id: parseInt(escaperoom_id!)
  };

  const handleSubmit = async (data: RoomModel) => {
    setLoading(true);
    setError(null);

    try {
      const res = await RoomService.create(data);

      if (res.success) {
        nav('/owner/escape-room/' + initialData.escaperoom_id, { state: { alert: { type: 'success', message: res.message } } });
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
    nav('/owner/escape-room/' + initialData.escaperoom_id, { state: { alert: { message: 'Operación cancelada', type: 'info' } } });
  };

  return (
    <RoomForm
      initialData={initialData}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      title="Nueva Sala"
      submitText="Crear Sala"
      cancelText="Cancelar"
    />
  );
}

export default RoomCreate;