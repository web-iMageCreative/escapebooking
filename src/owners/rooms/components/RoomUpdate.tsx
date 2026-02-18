import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RoomModel, Price, Schedule } from '../Room.Model';
import { RoomService } from '../Room.Service';
import RoomForm from './Room.Form';
import { ApiResponse } from '../../../shared/models/apiResponse.Model';

const RoomUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [initialData, setInitialData] = useState<RoomModel>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);
  
  const loadData = async () => {
    try {
      const RoomRes: ApiResponse = await RoomService.getRoom( parseInt(id!) );
      
      RoomRes.data.schedule.map( (s:any) => {
        let h = s.hour.split(':');
        s.hour = new Date(0, 0, 0, Number(h[0]), Number(h[1]));
      })
      
      setInitialData(RoomRes.data);
    } catch (err: any) {
      console.log(err);
      setError(err.message || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: RoomModel) => {
    setLoading(true);

    try {
      const res = await RoomService.update(data);
      if (res.success) {
        nav('/owner/escape-room/' + initialData?.escaperoom_id, { state: { alert: { type: 'success', message: res.message } } });
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    nav('/owner/escape-room/' + initialData?.escaperoom_id, { state: { alert: { message: 'Operación cancelada', type: 'info' } } });
  };

  if (loading && !initialData) {
    return <div>Cargando...</div>;
  }

  if (!initialData) {
    return <div>Sala no encontrada</div>;
  }
  
  
  return (
    <RoomForm
      initialData={initialData}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      title="Editar Sala"
      submitText="Actualizar"
      cancelText="Cancelar"
    />
  );
};

export default RoomUpdate;