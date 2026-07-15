import React, { RefAttributes, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RoomService } from '../Room.Service';
import { Alert, Button, Fab, FormControl, FormHelperText, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { RoomHolidaysFormError, RoomHolidaysModel } from '../Room.Model';
import { DatePicker, DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import { esES } from '@mui/x-date-pickers/locales';
import NotchedContainer from '../../../shared/components/CircularNotchedBox';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


const RoomHolidays: React.FC<any> = ({ id }) => {
  const params = useParams();
  const nav = useNavigate();
  const roomId = params.id || id;
  const [data, setData] = useState<RoomHolidaysModel>({ id: 0, name: '', date_ini: '', date_end: '', room_id: parseInt(roomId!) });
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [openCreate, setOpenCreate] = useState(false);  
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const location = useLocation();
  const [alertData, setAlertData] = useState<any>(location.state?.alert || {});
  const [validationError, setValidationError] = useState<RoomHolidaysFormError>({
    name:    { success: true, message: '' },
    dateIni: { success: true, message: '' },
    dateEnd: { success: true, message: '' }
  });

  useEffect(() => {
    getHolidays();
  }, []);

  const getHolidays = async () => {
    setLoading(true);
    try {
      const res = await RoomService.getHolidays(parseInt(roomId!));

      if (!res.success) {
        setAlertData({ 'message': res.message, 'type': 'info' });
        setOpenSnackbar(true);
      }
      
      setHolidays(res.data);
    } catch (err: any) {
      setAlertData({ 'message': err?.message, 'type': 'error' });
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
      return;
    }
  }

  const handleSnackbarClose = () => { setOpenSnackbar(false); }

  const handleSubmit = async () => {
    setLoading(true); 

    try {
      const res = await RoomService.createHoliday(data);

      if (res.success) {
        getHolidays();
        setAlertData({ 'message': 'Vacaciones fijadas correctamente', 'type': 'success' });
        setOpenSnackbar(true);
        setOpenCreate(false);
      } else {
        setAlertData({ 'message': res.message, 'type': 'error' });
        setOpenSnackbar(true);
      }
    } catch (err: any) {
      setAlertData({ 'message': err?.message, 'type': 'error' });
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
      return;
    }
  }

  const handleDeleteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.getAttribute('data-id');
    
    if (!id) return;
    setLoading(true);

    try {
      const res = await RoomService.deleteHoliday(parseInt(id));
      if (res.success) {
        getHolidays();
        setAlertData({ 'message': 'Vacaciones canceladas correctamente', 'type': 'success' });
        setOpenSnackbar(true);
      } else {
        setAlertData({ 'message': res.message, 'type': 'error' });
        setOpenSnackbar(true);
      }
    } catch (err: any) {
      setAlertData({ 'message': err?.message, 'type': 'error' });
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
      return;
    }   
  };

  const validate = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    switch (id) {
      case 'name':
        if (value.length > 100) {
          setValidationError({ ...validationError, name: { success: false, message: 'Máximo 100 caracteres' } });
        } else {
          setValidationError({ ...validationError, name: { success: true, message: '' } });
        }
        break;
      default:
        return true;
    }
  }

  return (
    <div className="contained holidays">
       
      <div className="info">
       <div className="title">
        <Fab aria-label="add" sx={{width: '36px', height: '36px', fontSize: '12px', backgroundColor: 'white'}}  onClick={() => nav('/owner/room/' + roomId)}>
          <ArrowBackIosNewIcon />
        </Fab>
        <h2>Periodos vacacionales</h2>
      </div>
        <p>En esta sección puedes configurar los días festivos para esta sala. Estos días no estarán disponibles para reservas.</p>
        <p>Selecciona los días festivos en el calendario y haz clic en "Guardar" para aplicarlos.</p>
      </div>

      <div className="list-container">

        <NotchedContainer 
          width={60}
          cornerRadius={20}
          bgColor="#f8f8f8"
          side="top"
          pos="end"
        />
      
        <header className='header-section'>
          <div className='title' style={{ width: 'calc(80%)'}}><h3>Vacaciones fijadas</h3></div>

          <div className="actions">
            <Fab color="primary" aria-label="add" sx={{width: '50px', height: '50px'}}  onClick={() => setOpenCreate(true)}>
              <AddIcon />
            </Fab>
          </div>
          <div style={{ width: 'calc(20%)' }}></div>
        </header>

        {holidays.length > 0 ? (
          <div className="list">
            <TableContainer sx={{bgcolor: 'white', borderRadius:'4px'}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Fecha de inicio</TableCell>
                    <TableCell>Fecha de fin</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { holidays.map( (holiday) => (
                  <TableRow key={holiday.id}>
                    <TableCell>{holiday.name}</TableCell>
                    <TableCell>{dayjs(holiday.date_ini).format('ddd DD MMMM')}</TableCell>
                    <TableCell>{dayjs(holiday.date_end).format('ddd DD MMMM')}</TableCell>
                    <TableCell>
                      <Button startIcon={<DeleteOutlineOutlinedIcon />} size="small" onClick={handleDeleteClick} data-id={holiday.id} color="error">
                        Cancelar
                      </Button>
                    </TableCell>
                  </TableRow>
                  )) }
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <div className="list">
            <p>No hay vacaciones fijadas.</p>
          </div>
        )}
      </div>

      {openCreate && (
        <div className="pop-overlayCreate" onClick={() => setOpenCreate(false)}>
          <div className="pop-contentCreate holidays-form" onClick={(e) => e.stopPropagation()}>
            <h3>Crear nuevo periodo</h3>

            <div className="form-group">
              <div className="col-label">
                <label htmlFor="name">Nombre</label>
                <p className="description">
                  Añade un nombre que te permita reconocer fácilmente este periodo vacacional. 
                  Por ejemplo: "Vacaciones de verano", "Navidad 2024", etc.
                </p>
              </div>
              <div className="col-value">
                <FormControl variant="filled" fullWidth>
                  <TextField
                    variant='filled'
                    sx={{ backgroundColor: 'white' }}
                    id="name"
                    label="Nombre"
                    slotProps={{
                      input: {
                        "aria-label": "Nombre"
                      },
                    }}
                    value={data.name}
                    onChange={ (e: any) => {setData({ ...data, name: e.target.value })} }
                    placeholder="Vacaciones de verano"
                    required
                    onBlur={validate}
                    error={!validationError.name.success}
                    disabled={loading}
                  />
                  <FormHelperText error={!validationError.name.success} id="error_name">{validationError.name.message}</FormHelperText>
                </FormControl>

              </div>
            </div>

            <div className="form-group">
              <div className="col-label">
                <label htmlFor="name">Fecha de inicio</label>
                <p className="description">
                  Selecciona la fecha de inicio del periodo vacacional. 
                  Esta fecha estará incluida en el periodo, 
                  por lo que la última fecha disponible para reservas será el día anterior a esta fecha.
                </p>
              </div>
              <div className="col-value">
                <FormControl variant="filled" fullWidth>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                    adapterLocale='es'
                  >
                    <DatePicker
                      label="Fecha de inicio"
                      value={dayjs(data.date_ini)}
                      onChange={(value: any) => {setData({ ...data, date_ini: value ? value.format('YYYY-MM-DD') : '' })}}
                      slotProps={{
                        textField: {
                          variant: 'filled', // 👈 Aquí aplicas el estilo "filled"
                          fullWidth: true,
                          size: 'medium',
                          sx: { backgroundColor: 'white' }
                        },
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
            </div>

            <div className="form-group">
              <div className="col-label">
                <label htmlFor="name">Fecha de Fin</label>
                <p className="description">
                  Selecciona la fecha de fin del periodo vacacional. 
                  Esta fecha estará incluida en el periodo, 
                  por lo que la primera fecha disponible para reservas será el día siguiente a esta fecha.
                </p>
              </div>
              <div className="col-value">
                <FormControl variant="filled" fullWidth>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                    adapterLocale='es'
                  >
                    <DatePicker
                      label="Fecha de fin"
                      value={dayjs(data.date_end)}
                      onChange={(value: any) => {setData({ ...data, date_end: value ? value.format('YYYY-MM-DD') : '' })}}
                      slotProps={{
                        textField: {
                          variant: 'filled', // 👈 Aquí aplicas el estilo "filled"
                          fullWidth: true,
                          size: 'medium',
                          sx: { backgroundColor: 'white' }
                        },
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>

              </div>
            </div>
          
            <div className="form-actions">
              <Button
                type="button"
                color="primary"
                size="large"
                variant="contained"
                onClick={handleSubmit}
              >
                Añadir
              </Button>
              <Button
                sx={{ marginLeft: '15px', backgroundColor: 'transparent', color: '#444' }}
                type="button"
                size="large"
                variant="contained"
                onClick={() => setOpenCreate(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
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

export default RoomHolidays;