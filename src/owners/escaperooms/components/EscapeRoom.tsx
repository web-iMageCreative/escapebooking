import React, { useEffect, useState } from 'react';
import { EscapeRoomModel } from '../EscapeRoom.Model';
import { EscapeRoomService } from '../EscapeRoom.Service';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import RoomList from '../../rooms/components/Room.List';
import { Alert, Snackbar } from '@mui/material';

const EscapeRoom: React.FC = () => {
    const params = useParams();
    const id:number = parseInt(params.id!);
    const nav = useNavigate();
    const location = useLocation();
    const alertData = location.state?.alert || {};
    const [open, setOpen] = useState<boolean>(false);

    const [escapeRoom, setEscapeRoom] = useState<EscapeRoomModel>({
        id: 0,
        name: '',
        owner: 0,
        address: '',
        postal_code: '',
        cif: '',
        email: '',
        phone: ''
    });
    
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (alertData.type) {
            setOpen(true);
            window.history.replaceState({}, document.title);
        }

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

    const handleSnackbarClose = () => { setOpen(false); }

    return (
        <div className='contained'>
            <div className='header-file'>
                <h2>{escapeRoom.name}</h2>
                <div className="actions">
                    <Link to={'/owner/rooms/new/' + escapeRoom.id}>Crear nueva Sala</Link>
                </div>
            </div>

            { escapeRoom && 
                <RoomList id={params.id}/>
            }

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={open}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
            >
            <Alert
                onClose={handleSnackbarClose}
                severity={alertData.type}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alertData.message}
            </Alert>
            </Snackbar>
        </div>
    );
}

export default EscapeRoom;