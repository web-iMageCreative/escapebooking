import React, { useEffect, useState } from 'react';
import './Room.List.css';
import { RoomService } from './Room.Service';
import { RoomModel } from './Room.Model';
import { useParams } from 'react-router-dom';

const RoomList: React.FC = () => {
    const params = useParams();
    const [rooms, setRooms] = useState<RoomModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const escaperoom_id = params.escaperoom_id;


    useEffect(() => {
        getRooms();
        }, []);

    const getRooms = async () => {
        try {
            const res = await RoomService.getRooms(escaperoom_id);
            setRooms(res.data);
        } catch {
            setError('Error en la carga de las salas');
        } finally {
            return;
        }
    }


    return (<>
        <div className='contenido-rooms'>
        <h2>Salas del Escaperoom</h2>
        <div className='lista-rooms'>
            {rooms.map(room => (
            <div className='carta-room'>
                <div className='cabecera-room' key={room.id}>
                <h3>{room.name}</h3>
                </div>
                <p>{room.description}</p>
                <p>{room.duration}</p>
                <p>{room.price}</p>
            </div>
            ))}
        </div>
        </div>
    </>
    );
}

export default RoomList;
