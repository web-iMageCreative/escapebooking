import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EscapeRoomModel } from './EscapeRoom.Model';
import { Province } from '../../shared/models/province.Model';
import { EscapeRoomService } from './EscapeRoom.Service';
import { getProvinces } from '../../shared/data/provinces';
import EscapeRoomForm from './EscapeRoom.Form';
import { ApiResponse } from '../../shared/models/Response.Model';

const EscapeRoomUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [initialData, setInitialData] = useState<EscapeRoomModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const escapeRoomRes: ApiResponse = await EscapeRoomService.getEscaperoom(parseInt(id!));
      setInitialData(escapeRoomRes.data);
    } catch (err: any) {
      setError(err.message || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: EscapeRoomModel) => {
    setLoading(true);

    try {
      const res = await EscapeRoomService.update(data);
      if (res.success) {
        nav('/owner/escape-rooms', { state: { alert: { type: 'success', message: res.message } } });
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
    nav('/owner/escape-rooms', { state: { alert: { message: 'Operación cancelada', type: 'info' } } });
  };

  if (loading && !initialData) {
    return <div>Cargando...</div>;
  }

  if (!initialData) {
    return <div>Escape Room no encontrado</div>;
  }

  return (
    <EscapeRoomForm
      initialData={initialData}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      title="Editar Escape Room"
      submitText="Actualizar"
      cancelText="Cancelar"
    />
  );
};

export default EscapeRoomUpdate;