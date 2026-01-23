import React, { useEffect, useState } from 'react';
import './EscapeRoom.css';
import { EscapeRoomModel } from './EscapeRoom.Model';
import { EscapeRoomService } from './EscapeRoom.Service';
import { User } from '../../users/UserModel';
import { AuthService } from '../../auth/AuthService';
import { ROUTES } from '../../routes';
import { Link } from 'react-router-dom';

const EscapeRoom: React.FC = () => {
  const [data, setData] = useState<EscapeRoomModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUser: User = AuthService.getCurrentUser();


  useEffect(() => {
    getEscaperooms();
  }, []);

  const getEscaperooms = async () => {
    try {
      const res = await EscapeRoomService.getEscaperooms(currentUser.id);
      setData(res.data);
    } catch(err: any) {
      const errMessage = err?.message || 'Error en la carga de Escaperooms';
      setError(errMessage);
    } finally {
      return;
    }
  }

  return (<>
    <div className='contenido-escaperooms'>
      <h2>Todos los EscapeRooms</h2>
      <div className='lista-escaperooms'>
        {data.map(escaperoom => (
          <div className='carta-escaperoom'>
            <div className='cabecera-escaperoom' key={escaperoom.id}>
              <h3>{escaperoom.name}</h3>
              <Link className='ver-ficha' to={'/owner/escape-room/' + escaperoom.id}>Ver Ficha</Link>
            </div>
            <p>{escaperoom.description}</p>
            <p>{escaperoom.address}</p>
            <p>{escaperoom.province}</p>
            <p>{escaperoom.owner}</p>
          </div>
        ))}
      </div>
    </div>
  </>
  );
};

export default EscapeRoom;