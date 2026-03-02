import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { AuthService } from "../AuthService";

const Paypal: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const initialOptions = {
    clientId: "AcVoDh51dfGFZRauylq59NZYdjJAJZRHES2-v9eYgTck08AHeBMDgCc5myqz9QDYsD3aZUjOB4hCbdKb",
    currency: "EUR",
    intent: "capture",
  };

  return (
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons

          />
        </PayPalScriptProvider>
      )}

export default Paypal;