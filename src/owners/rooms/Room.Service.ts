import { RoomModel } from './Room.Model';
import { ApiResponse } from '../../shared/models/apiResponse.Model';

const API_BASE_URL = 'http://localhost/api-php';
const token = localStorage.getItem('auth_token');

export class RoomService {
  
  
  static async getRooms(escaperoomId: number): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE_URL}/owners/rooms/list.php?escaperoom_id=${escaperoomId}`);

    if (!res.ok) {
      throw new Error('Error obteniendo salas');
    }
    
    return res.json();
  }

  static async getRoom(id: number): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE_URL}/owners/rooms/get.php?id=${id}`);
    
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.message);
    }

    const result = await res.json();
    
    return result;
  }

  static async create(data: RoomModel): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE_URL}/owners/rooms/create.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const result = await res.json()
      throw new Error(result.message);
    }

    const result = await res.json();

    return result;
  }

  static async update(data: RoomModel): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE_URL}/owners/rooms/update.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const result = await res.json()
      throw new Error(result.message);
    }

    const result = await res.json();

    return result;
  }

  static async delete(id: number): Promise<ApiResponse> {
    const data = { 'id': id };
    const res = await fetch(`${API_BASE_URL}/owners/rooms/delete.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.message);
    }

    const result = await res.json();

    return result;
  }

}