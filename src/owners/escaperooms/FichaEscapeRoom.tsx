import React, { useEffect, useState } from 'react';
import './FichaEscapeRoom.css';
import { EscapeRoomModel } from './EscapeRoom.Model';
import { EscapeRoomService } from './EscapeRoom.Service';
import { useParams } from 'react-router-dom';

const FichaEscapeRoom: React.FC = () => {
    const params = useParams();
    const id:string | undefined = params.id;

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
            const res = await EscapeRoomService.getEscaperoom( params.id );
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
                <button className='btn-editar'>Editar Escaperoom</button>
            </div>
            <div className='contenido-ficha'>
                <p>{escapeRoom.description}</p>
            </div>
        </div>
    );
}

export default FichaEscapeRoom;