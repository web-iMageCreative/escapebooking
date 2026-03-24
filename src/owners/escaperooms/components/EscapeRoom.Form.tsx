import React, { useEffect, useState } from 'react';
import { EscapeRoomFormProps, EscapeRoomModel, EscapeRoomFormError } from '../EscapeRoom.Model';
import  { Snackbar, Alert, Chip, TextField, FormControl, InputAdornment, FormHelperText, MenuItem, Button } from '@mui/material';
import { WidthNormal } from '@mui/icons-material';

const EscapeRoomForm: React.FC<EscapeRoomFormProps> = ({
  initialData,
  loading,
  error,
  onSubmit,
  onCancel,
  title = "Escape Room",
  submitText = "Guardar",
  cancelText = "Cancelar"
}) => {
  const [data, setData] = useState<EscapeRoomModel>(initialData);
  const [open, setOpen] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<EscapeRoomFormError>({
      name: { success: true, message: '' },
      address: { success: true, message: '' },
      postal_code: { success: true, message: '' },
      cif:  { success: true, message: '' },
      email: { success: true, message: '' },
      phone: { success: true, message: '' },
    })

  useEffect(() => {
    if ( error !== null ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [error]);

  const handleSnackbarClose = () => { setOpen(false); }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

//  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//    const value = e.target.value;
//    setProvinceSelected(value);
//    setData({
//      ...data,
//      province: parseInt(value) || 0
//    });
//  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setData({
      ...data,
      [id]: value
    });
  };

  const validate = ( e: React.FocusEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
  
      switch (id) {
        case 'name':
          if ( value.length > 100 ) {
            setValidationError({...validationError, name: {success: false, message: 'Máximo 100 caracteres'}} );
          } else {
            setValidationError({...validationError, name: {success: true, message: ''}} );
          }
          break;
      
        case 'address':
          if ( value.length > 500 ) {
            setValidationError({...validationError, address: {success: false, message: 'Máximo 500 caracteres'}} );
          } else {
            setValidationError({...validationError, address: {success: true, message: ''}} );
          }
          break;

        case 'postal_code': {
          const postalCodeRegex = /^[0-9]{5}$/;
          if ( !value ) {
            setValidationError({...validationError, postal_code: {success: false, message: 'El código postal es obligatorio'}} );
          } else if ( !postalCodeRegex.test(value) ) {
            setValidationError({...validationError, postal_code: {success: false, message: 'El código postal debe tener 5 dígitos'}} );
          } else {
            setValidationError({...validationError, postal_code: {success: true, message: ''}} );
          }
          break;
        }

        case 'cif': {
          const cifRegex = /^[A-HJNP-SUVW][0-9]{7}[0-9A-J]$/i;
          if ( !value ) {
            setValidationError({...validationError, cif: {success: false, message: 'El CIF es obligatorio'}} );
          } else if ( !cifRegex.test(value) ) {
            setValidationError({...validationError, cif: {success: false, message: 'El CIF no tiene un formato válido (ej: B12345678)'}} );
          } else {
            setValidationError({...validationError, cif: {success: true, message: ''}} );
          }
          break;
        }

        case 'email': {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if ( !value ) {
            setValidationError({...validationError, email: {success: false, message: 'El email es obligatorio'}} );
          } else if ( !emailRegex.test(value) ) {
            setValidationError({...validationError, email: {success: false, message: 'El email no tiene un formato válido'}} );
          } else {
            setValidationError({...validationError, email: {success: true, message: ''}} );
          }
          break;
        }

        case 'phone': {
          const phoneRegex = /^(\+34|0034)?[6789][0-9]{8}$/;
          if ( !value ) {
            setValidationError({...validationError, phone: {success: false, message: 'El teléfono es obligatorio'}} );
          } else if ( !phoneRegex.test(value.replace(/\s/g, '')) ) {
            setValidationError({...validationError, phone: {success: false, message: 'El teléfono no tiene un formato válido (ej: 612345678)'}} );
          } else {
            setValidationError({...validationError, phone: {success: true, message: ''}} );
          }
          break;
        }
  
        default:
          return true;
      }
  }

  return (
    <div>
      <form className="form contained" onSubmit={handleSubmit}>
        <h2>{title}</h2>

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
                sx={{backgroundColor: 'white'}}
                id="name"
                label="Nombre"
                slotProps={{
                    input: {
                      "aria-label": "Nombre"
                    },
                  }}
                value={data.name}
                onChange={handleInputChange}
                placeholder="Escape Masters Madrid"
                required
                onBlur={validate}
                error={!validationError.name.success}
                disabled={loading}
              />
              <FormHelperText error={!validationError.name.success} id="error_name">{validationError.name.message}</FormHelperText>
            </FormControl>
          </div>
        </div>
        {/* <div className="form-group"> */}
        <div>
          <div className="col-label">
            <label>Datos de Facturación</label>
            <p className="description">
              Datos de Facturación.
            </p>
          </div>

          <div className="col-value">
            <div>
              <FormControl variant="filled" sx={{m: 2, width: '62%'}} >
                <TextField
                  sx={{backgroundColor: 'white'}}
                  variant="filled"
                  type="text"
                  id="address"
                  label="Dirección"
                  slotProps={{
                      input: {
                        "aria-label": "Dirección"
                      },
                    }}
                  value={data.address}
                  onBlur={validate}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                  error={!validationError.address.success}
                />
                <FormHelperText error={!validationError.address.success} id="error_address">{validationError.address.message}</FormHelperText>
              </FormControl>

              <FormControl variant="filled" sx={{m: 2}}>
                <TextField
                  sx={{backgroundColor: 'white'}}
                  variant="filled"
                  type="text"
                  id="postal_code"
                  label="Código Postal"
                  slotProps={{
                    input: {
                      "aria-label": "Código Postal"
                    },
                  }}
                  value={data.postal_code}
                  onChange={handleInputChange}
                  onBlur={validate}
                  required
                  disabled={loading}
                  error={!validationError.postal_code.success}
                />
                <FormHelperText error={!validationError.postal_code.success} id="error_postal_code">{validationError.postal_code.message}</FormHelperText>
              </FormControl>
            </div>

            <div>
              <FormControl variant="filled" sx={{m: 2}}>
                <TextField
                  sx={{backgroundColor: 'white'}}
                  variant="filled"
                  type="text"
                  id="cif"
                  label="Cif"
                  slotProps={{
                    input: {
                      "aria-label": "Dirección"
                    },
                  }}
                  value={data.cif}
                  onChange={handleInputChange}
                  onBlur={validate}
                  required
                  disabled={loading}
                  error={!validationError.cif.success}
                />
                <FormHelperText error={!validationError.cif.success} id="error_cif">{validationError.cif.message}</FormHelperText>
              </FormControl>
              
              <FormControl variant="filled" sx={{m: 2}}>
                <TextField
                  sx={{backgroundColor: 'white'}}
                  variant="filled"
                  type="text"
                  id="email"
                  label="Email"
                  slotProps={{
                    input: {
                      "aria-label": "Dirección"
                    },
                  }}
                  value={data.email}
                  onChange={handleInputChange}
                  onBlur={validate}
                  required
                  disabled={loading}
                  error={!validationError.email.success}
                />
              </FormControl>

              <FormControl variant="filled" sx={{m: 2}}>
                <TextField
                  sx={{backgroundColor: 'white'}}
                  variant="filled"
                  type="text"
                  id="phone"
                  label="Teléfono"
                  slotProps={{
                    input: {
                      "aria-label": "Dirección"
                    },
                  }}
                  value={data.phone}
                  onChange={handleInputChange}
                  onBlur={validate}
                  required
                  disabled={loading}
                  error={!validationError.phone.success}
                />
              </FormControl>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary button"
          >
            {loading ? 'Procesando...' : submitText}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary button"
          >
            {cancelText}
          </button>
        </div>

      </form>
      
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EscapeRoomForm;