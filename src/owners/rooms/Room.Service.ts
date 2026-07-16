import { RoomHolidaysModel, RoomModel } from './Room.Model';
import { ApiResponse } from '../../shared/models/apiResponse.Model';

const API_BASE_URL = 'http://localhost/api-php';

export class RoomService {

  static async getRooms(escaperoomId: number): Promise<ApiResponse> {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE_URL}/owners/rooms/list.php?escaperoom_id=${escaperoomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      res.json().then(result => {
        throw new Error(result.message);
      });
    }
    
    return res.json();
  }

  static async getRoom(id: number, dayWeek?: number): Promise<ApiResponse> {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE_URL}/owners/rooms/get.php?id=${id}` + (dayWeek ? `&dayWeek = ${dayWeek}` : ``), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.message);
    }

    const result = await res.json();
    
    return result;
  }

  static async create(data: RoomModel): Promise<ApiResponse> {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE_URL}/owners/rooms/create.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': `Bearer ${token}`
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
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE_URL}/owners/rooms/update.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': `Bearer ${token}`
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
    const token = localStorage.getItem('auth_token');
    const data = { 'id': id };
    const res = await fetch(`${API_BASE_URL}/owners/rooms/delete.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': `Bearer ${token}`
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

  static async getHolidays(id: number): Promise<ApiResponse> {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE_URL}/owners/rooms/holidays/list.php?room_id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': `Bearer ${token}`
      }
    }); 

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.message);
    }

    const result = await res.json();

    return result;
  }

  static async createHoliday(data: RoomHolidaysModel): Promise<ApiResponse> {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${API_BASE_URL}/owners/rooms/holidays/create.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': `Bearer ${token}`
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

  static async deleteHoliday(id: number): Promise<ApiResponse> {
    const token = localStorage.getItem('auth_token');
    const data = { 'holidays_id': id };
    const res = await fetch(`${API_BASE_URL}/owners/rooms/holidays/delete.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': `Bearer ${token}`
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