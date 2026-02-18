import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EscapeRoomModel, UpdateFormProp } from '../EscapeRoom.Model';
import { EscapeRoomService } from '../EscapeRoom.Service';
import EscapeRoomForm from './EscapeRoom.Form';
import { ApiResponse } from '../../../shared/models/apiResponse.Model';

const EscapeRoomUpdate: React.FC<UpdateFormProp> = ({id: updateId, onCancel}) => {
  const { id: paramId } = useParams<{ id: string }>();
  const id = updateId ?? (paramId ? parseInt(paramId) : undefined);
  const nav = useNavigate();
  const [initialData, setInitialData] = useState<EscapeRoomModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const escapeRoomRes: ApiResponse = await EscapeRoomService.getEscaperoom(id!);
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
        onCancel();
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
    onCancel();
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