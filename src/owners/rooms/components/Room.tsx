import React, { useEffect, useState } from 'react';
import { RoomModel } from '../Room.Model';
import { RoomService } from '../Room.Service';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Room: React.FC = () => {
    const params = useParams();
    const id:string | undefined = params.id;

    const [room, setRoom] = useState<RoomModel>({
        id: 0,
        name: '',
        description: '',
        duration: 0,
        schedule: [],
        min_players: 0,
        max_players: 0,
        prices: [],
        escaperoom_id: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getRoom();
    }, []);
        
    const getRoom = async () => {
        try {
            const res = await RoomService.getRoom( parseInt(params.id!) );
            setRoom(res.data);
        } catch {
            setError('Error en la carga de Escaperooms');
        } finally {
            return;
        }
    }

    return (
        <div className='ficha contained'>
            <div className='cabecera'>
                <h3>{room.name}</h3>
                <div className="actions">
                    <Link to={'/owner/rooms/edit/' + id}>Editar Sala</Link>
                    <Link to={'/booking/' + id}>Reservar Sala</Link>
                </div>
            </div>
            <div className='contenido-ficha'>
                <p>{room.description}</p>
            </div>
            <div className="players">
                <div className='min-players'>
                    <h4>Mínimo de Jugadores</h4>
                    <p>{room.min_players}</p>
                </div>
                <div className='max-players'>
                    <h4>Máximo de Jugadores</h4>
                    <p>{room.max_players}</p>
                </div>
            </div>
        </div>
    );
}

export default Room;