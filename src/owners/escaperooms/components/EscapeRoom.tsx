import React, { useEffect, useState } from 'react';
import '../styles/EscapeRoom.css';
import { EscapeRoomModel } from '../EscapeRoom.Model';
import { EscapeRoomService } from '../EscapeRoom.Service';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import RoomList from '../../rooms/components/Room.List';
import { ROUTES } from '../../../routes';

const EscapeRoom: React.FC = () => {
    const params = useParams();
    const id:number = parseInt(params.id!);

    const [escapeRoom, setEscapeRoom] = useState<EscapeRoomModel>({
        id: 0,
        name: '',
        description: '',
        address: '',
        province: 0,
        owner: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getEscaperooms();
    }, []);
        
    const getEscaperooms = async () => {
        try {
            const res = await EscapeRoomService.getEscaperoom( id );
            setEscapeRoom(res.data);
        } catch {
            setError('Error en la carga de Escaperooms');
        } finally {
            return;
        }
    }

    return (
        <div className='ficha'>
            <div className='cabecera-ficha'>
                <h1>{escapeRoom.name}</h1>
                <div className="actions">
                    <Link to={'/owner/escape-rooms/edit/' + id}>Editar Escaperoom</Link>
                    <Link to={'/owner/rooms/new/' + escapeRoom.id}>Crear nueva Sala</Link>
                </div>
            </div>
            <div className='contenido-ficha'>
                <p>{escapeRoom.description}</p>
            </div>

            { escapeRoom && 
                <RoomList id={params.id}/>
            }
        </div>
    );
}

export default EscapeRoom;