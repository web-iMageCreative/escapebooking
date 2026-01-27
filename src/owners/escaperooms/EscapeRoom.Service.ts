import { EscapeRoomModel } from './EscapeRoom.Model';
import { ApiResponse } from '../../shared/models/apiResponse.Model';

const API_BASE_URL = 'http://localhost/api-php';
const token = localStorage.getItem('auth_token');

export class EscapeRoomService {
  
  static async create(data: EscapeRoomModel): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/owners/escaperooms/create.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.message);
    }

    const result = await response.json();

    return result;
  }

  static async update(data: EscapeRoomModel): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/owners/escaperooms/update.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.message);
    }

    const result = await response.json();

    return result;
  }

  static async delete( id: number ): Promise<ApiResponse> {
    const data = {'id': id};
    const response = await fetch(`${API_BASE_URL}/owners/escaperooms/delete.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message);
    }

    const result = await response.json();

    return result;
  }

  static async getProvinces(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/shared/provinces/get.php`);

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.message);
    }

    const result = await response.json();

    return result;
  }  

  static async getEscaperooms( userId: number ): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/owners/escaperooms/list.php?userid=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message);
    }

    const result = await response.json();

    return result;
  }

  static async getEscaperoom(id: number): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/owners/escaperooms/get.php?id=${id}`);

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message);
    }

    const result = await response.json();

    return result;
  }

}