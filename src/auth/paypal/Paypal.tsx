import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { AuthService } from "../AuthService";
import { PaypalProps } from "../../users/UserModel";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";

const Paypal: React.FC<PaypalProps> = ({ credentials }) => {
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const initialOptions = {
    clientId: "AcVoDh51dfGFZRauylq59NZYdjJAJZRHES2-v9eYgTck08AHeBMDgCc5myqz9QDYsD3aZUjOB4hCbdKb",
    currency: "EUR",
    intent: "capture",
  };

  const createOrder = async () => {
    const res = await AuthService.createPaypalOrder(credentials.email);
    return res.orderID;
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      const res = await AuthService.capturePaypalAndRegister({
        orderID: data.orderID,
        email: credentials.email,
        password: credentials.password,
      });

      if (res.success) {
        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        nav("/owner/dashboard", {
          state: { alert: { type: "info", message: "Cuenta creada y pago completado correctamente." } },
        });
      } else {
        setError(res.message || "Error al procesar el pago o registro.");
      }
    } catch (err) {
      setError("Error inesperado al completar el registro.");
    }
  };

  const onError = () => {
    setError("El pago no pudo completarse. Inténtelo de nuevo.");
  };

  return (
    <>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          disabled={!credentials.email || !credentials.password}
        />
      </PayPalScriptProvider>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert severity="error" variant="filled" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Paypal;
