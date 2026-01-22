import { EscapeRoomModel, Province } from './EscapeRoom.Model';
import { ApiResponse } from '../../shared/models/Response.Model';

const API_BASE_URL = 'http://localhost/api-php';
const token = localStorage.getItem('auth_token');

export class EscapeRoomService {
  static async create(data: EscapeRoomModel): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE_URL}/owners/escaperooms/create.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const resJson = await res.json()
      throw new Error(resJson.message);
    }

    return await res.json();
  }

  static async getProvinces(): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE_URL}/shared/provinces/get.php`);

    if (!res.ok) {
      const resJson = await res.json()
      throw new Error(resJson.message);
    }

    return await res.json();
  }

}