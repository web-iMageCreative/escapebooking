import React, { useEffect, useState } from 'react';
import './Room.css';
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
        <div className='ficha'>
            <div className='cabecera'>
                <h1>{room.name}</h1>
                <div className="acciones">
                    <button className='btn-editar'>Editar Sala</button>
                </div>
            </div>
            <div className='contenido-ficha'>
                <p>{room.description}</p>
            </div>
            <div className="players">
                <div className='min-players'>
                    <h2>Mínimo de Jugadores</h2>
                    <p>{room.min_players}</p>
                </div>
                <div className='max-players'>
                    <h2>Máximo de Jugadores</h2>
                    <p>{room.max_players}</p>
                </div>
            </div>
        </div>
    );
}

export default Room;