import React, { useEffect, useState } from 'react';
import './Room.css';
import { RoomModel } from './Room.Model';
import { RoomService } from './Room.Service';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Room: React.FC = () => {
    const params = useParams();
    const id:string | undefined = params.id;

    const [Room, setRoom] = useState<RoomModel>({
        id: 0,
        name: '',
        description: '',
        duration: 0,
        price: 0,
        escaperoom_id: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getRooms();
    }, []);
        
    const getRooms = async () => {
        try {
            const res = await RoomService.getRooms((params.id) );
            setRoom(res.data);
        } catch {
            setError('Error en la carga de Escaperooms');
        } finally {
            return;
        }
    }

    return (
        <div className='ficha'>
            <div className='cabecera-ficha'>
                <h1>{Room.name}</h1>
                <div className="acciones">
                    <button className='btn-editar'>Editar Sala</button>
                </div>
            </div>
            <div className='contenido-ficha'>
                <p>{Room.description}</p>
            </div>
        </div>
    );
}

export default Room;