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
            throw new Error('Login failed');
        }
        
        return await res.json();
    }

    static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE_URL}/register.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        });
        
        if (!res.ok) {
            throw new Error('Login failed');
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