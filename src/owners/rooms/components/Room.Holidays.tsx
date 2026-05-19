import React, { RefAttributes, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { RoomService } from '../Room.Service';
import { Alert, Button, FormControl, FormHelperText, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { RoomHolidaysFormError, RoomHolidaysModel } from '../Room.Model';
import { DatePicker, DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import dayjs from 'dayjs';
import { esES } from '@mui/x-date-pickers/locales';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const RoomHolidays: React.FC<any> = ({ id }) => {
  const params = useParams();
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
    <div className="form contained holidays">
       
      <h3>Periodos vacacionales</h3>
      <p>En esta sección puedes configurar los días festivos para esta sala. Estos días no estarán disponibles para reservas.</p>
      <p>Selecciona los días festivos en el calendario y haz clic en "Guardar" para aplicarlos.</p>
      
      <div className='header-file'>
        <h4>Vacaciones fijadas</h4>

        <div className="actions">
          <Button
            type="button"
            color="primary"
            size="large"
            variant="contained"
            onClick={() => setOpenCreate(true)}
          >
            Crear nuevo periodo
          </Button>
        </div>
      </div>

      {holidays.length > 0 ? (
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
      ) : (
        <p>No hay vacaciones fijadas.</p>
      )}

      {openCreate && (
        <div className="pop-overlayCreate" onClick={() => setOpenCreate(false)}>
          <div className="pop-contentCreate" onClick={(e) => e.stopPropagation()}>
            <h3>Crear nuevo periodo</h3>

            <div className="form-group">
              <div className="col-label">
                <label htmlFor="name">Nombre</label>
                <p className="description">
                  Nombre comercial de tu escape room.
                  Aparecerá en los listados de búsqueda.
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
                  Nombre comercial de tu escape room.
                  Aparecerá en los listados de búsqueda.
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
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
            </div>

            <div className="form-group">
              <div className="col-label">
                <label htmlFor="name">Fecha de Fin</label>
                <p className="description">
                  Nombre comercial de tu escape room.
                  Aparecerá en los listados de búsqueda.
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
                    />
                  </LocalizationProvider>
                </FormControl>

              </div>
            </div>

            <Button
              sx={{ marginTop: "30px" }}
              type="button"
              color="primary"
              size="large"
              variant="contained"
              onClick={handleSubmit}
            >
              Fijar vacaciones
            </Button>
            <Button
              sx={{ marginLeft: '15px', marginTop: '30px', backgroundColor: 'transparent', color: '#444' }}
              type="button"
              size="large"
              variant="contained"
              onClick={() => setOpenCreate(false)}
            >
              Cancelar
            </Button>
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