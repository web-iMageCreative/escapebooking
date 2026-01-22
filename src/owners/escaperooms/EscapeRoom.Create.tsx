import React, { useEffect, useState } from 'react';
import { EscapeRoomModel, Province } from './EscapeRoom.Model';
import { EscapeRoomService } from './EscapeRoom.Service';
import './EscapeRoom.Create.css';
import { AuthService } from '../../auth/AuthService';
import { User } from '../../users/UserModel';
import { data } from 'react-router-dom';

const EscapeRoomCreate: React.FC = () => {
  const [data, setData] = useState<EscapeRoomModel>({
    id: 0,
    name: '',
    description: '',
    address: '',
    province: 0,
    owner: 0
  });
  const [provinceSelected, setProvinceSelected] = useState('0');
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUser: User = AuthService.getCurrentUser();
  
  useEffect( () => {
    getProvinces();
    setData({
      ...data,
      owner: currentUser.id
    });
  }, []);

  const getProvinces = async () => {
    try {
      const res = await EscapeRoomService.getProvinces();
      setProvinces(res.data);
    } catch {
      setError('Error en la carga de Provincias');
    } finally {
      return;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await EscapeRoomService.create(data);

      if (res.success) {

        window.location.href = '/owner/dashboard';

      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProvince = ( e: React.ChangeEvent<HTMLSelectElement> ) => {
    setProvinceSelected( e.target.value );
    setData({
      ...data,
      province: parseInt(e.target.value)
    })
  };

  return (
    <div className="escaperoom-form-container">
      <form className="escaperoom-form contained" onSubmit={handleSubmit}>
        
        <h2>Nuevo EscapeRoom</h2>
        
        <div className="form-group">
          <div className="col-label">
            <label htmlFor="name">Nombre</label>
            <p className="description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. 
              Dolorum corporis vel aspernatur! Iure laborum mollitia 
              corrupti nulla impedit.
            </p>
          </div>
          <div className="col-value">
            <input
              type="text"
              id="name"
              value={data.name}
              onChange={(e) => setData({
                ...data,
                name: e.target.value
              })}
              placeholder="Nombre del Negocio"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="col-label">
            <label htmlFor="description">Descripción</label>
            <p className="description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. 
              Dolorum corporis vel aspernatur! Iure laborum mollitia 
              corrupti nulla impedit.
            </p>
          </div>
          <div className="col-value">
            <textarea
              id="description"
              value={data.description}
              onChange={(e) => setData({
                ...data,
                description: e.target.value
              })}
              placeholder="Descripción del Negocio"
              rows={6}
              required
            ></textarea>
          </div>
        </div>

        <div className="form-group">
          <div className="col-label">
            <label htmlFor="address">Dirección</label>
            <p className="description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Dolorum corporis vel aspernatur! Iure laborum mollitia
              corrupti nulla impedit.
            </p>
          </div>
          <div className="col-value">
            <input
              type="text"
              id="address"
              value={data.address}
              onChange={(e) => setData({
                ...data,
                address: e.target.value
              })}
              placeholder="Dirección del Negocio"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="col-label">
            <label htmlFor="province">Provincia</label>
            <p className="description">
            </p>
          </div>
          <div className="col-value">
          <select id="province" value={provinceSelected} onChange={handleProvince}>
            <option value="0">-- Elige una --</option>
            { provinces.map((opcion) => (
              <option key={opcion.id} value={opcion.id}>
                {opcion.name + " (" + opcion.code + ")"}
              </option>
            )) }
          </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Guardar'}
          </button>

          <button type="button" onClick={ () => window.location.href = '/owner/dashboard'}>
            Cancelar
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}

      </form>
    </div>
  );
};

export default EscapeRoomCreate;

function setSelectedOption(value: any) {
  throw new Error('Function not implemented.');
}
