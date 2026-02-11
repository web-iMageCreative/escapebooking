import React, { useEffect, useState } from 'react';
import { EscapeRoomModel } from '../EscapeRoom.Model';
import { EscapeRoomService } from '../EscapeRoom.Service';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import RoomList from '../../rooms/components/Room.List';

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
        getEscaperoom();
    }, []);
        
    const getEscaperoom = async () => {
        try {
            const res = await EscapeRoomService.getEscaperoom( id );
            setEscapeRoom(res.data);
        } catch {
            setError('Error en la carga de datos');
        } finally {
            return;
        }
    }

    return (
        <div className='contained'>
            <div className='header-file'>
                <h2>{escapeRoom.name}</h2>
                <div className="actions">
                    <Link to={'/owner/escape-rooms/edit/' + id}>Editar Escaperoom</Link>
                    <Link to={'/owner/rooms/new/' + escapeRoom.id}>Crear nueva Sala</Link>
                </div>
            </div>
            <div className='description-file'>
                <p>{escapeRoom.description}</p>
            </div>

            { escapeRoom && 
                <RoomList id={params.id}/>
            }
        </div>
    );
}

export default EscapeRoom;