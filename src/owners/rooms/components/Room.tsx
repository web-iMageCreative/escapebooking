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
        duration: 0,
        schedule: [],
        min_players: 0,
        max_players: 0,
        prices: [],
        escaperoom_id: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dayWeek = [
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
        'Domingo'
    ]

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
        <div className="form contained">

            <div className="header-file">
                <div><h3>{room.name}</h3></div>
                <div className="actions">
                    <Link to={'/owner/rooms/edit/' + id}>Editar Sala</Link>
                    <Link to={'/booking/' + id}>Reservar Sala</Link>
                </div>
            </div>

            <div className="form-group">
                <div className="col-label"><label>Duración</label></div>
                <div className="col-value"><p>{room.duration} min</p></div>
            </div>

            <div className="form-group">
                <div className="col-label"><label>Mínimo de jugadores</label></div>
                <div className="col-value"><p>{room.min_players}</p></div>
            </div>

            <div className="form-group">
                <div className="col-label"><label>Máximo de jugadores</label></div>
                <div className="col-value"><p>{room.max_players}</p></div>
            </div>

            <div className="form-group">
                <div className="col-label"><label>Precios</label></div>
                <div className="col-value">
                    {room.prices.length === 0
                        ? <p>No hay precios</p> : room.prices.map((price, i) => (
                            <p key={i}>{price.num_players} jugadores — {price.price} €</p>
                        ))
                    }
                </div>
            </div>

            <div className="form-group">
                <div className="col-label"><label>Horarios</label></div>
                <div className="col-value">
                    {room.schedule.length === 0
                        ? <p>No hay horarios</p> : dayWeek.map((dayWeek, i) => (
                            <div key={i}>
                                <h3>{dayWeek}</h3>
                                {room.schedule.filter((schedule) => schedule.day_week === i).map((schedule, j) => (
                                    <p key={j}>{schedule.strHour}</p>
                                ))}
                            </div>
                        ))
                    }
                </div>
            </div>

            {room.notes && (
                <div className="form-group">
                    <div className="col-label"><label>Notas</label></div>
                    <div className="col-value"><p>{room.notes}</p></div>
                </div>
            )}

        </div>
    );
}

export default Room;