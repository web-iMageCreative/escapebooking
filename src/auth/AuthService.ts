import { LoginCredentials, AuthResponse, RegisterCredentials } from '../users/UserModel';

const API_BASE_URL = 'http://localhost/api-php/auth';

export class AuthService {
    static async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE_URL}/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        
        if (!res.ok) {
            throw new Error('Identificación fallida');
        }
        
        return await res.json();
    }

    static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE_URL}/register.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                confirmPassword: credentials.confirmPassword,
                businessName: credentials.businessName,
                address: credentials.address,
                phone: credentials.phone,
                city: credentials.city
            })
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Registro fallido');
        }
        
        return await res.json();
    }

    static async createPaypalOrder(email: string): Promise<{ orderID: string }> {
        const res = await fetch(`${API_BASE_URL}/order.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!res.ok) throw new Error('Error al crear la orden de PayPal');
        return await res.json();
    }

    static async capturePaypalAndRegister(payload: { orderID: string; email: string; password: string; }): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE_URL}/capture.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Error al capturar el pago o registrar el usuario');
        return await res.json();
    }

    static async forgotPassword(email: string): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE_URL}/forgot-password.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email})
        });

        if (!res.ok) {
            const result = await res.json();
            throw new Error(result.message);
        }

        return await res.json();
    }

    static async resetPassword(password: string, token: string): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE_URL}/reset-password.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password, token: token })
        });

        if (!res.ok) {
            const result = await res.json();
            throw new Error(result.message);
        }

        return await res.json();
    }

    
    static logout(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    }
    
    static isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token');
    }
    
    static getCurrentUser(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}