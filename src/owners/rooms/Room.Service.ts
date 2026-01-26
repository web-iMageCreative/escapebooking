import { RoomModel } from './Room.Model';
import { ApiResponse } from '../../shared/models/Response.Model';

const API_BASE_URL = 'http://localhost/api-php';
const token = localStorage.getItem('auth_token');

export class RoomService {

  static async getRooms(id: string | undefined): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE_URL}/owners/escaperooms/getRooms?escaperoom_id=${id}`);

  if (!res.ok) {
    throw new Error('Error obteniendo salas');
  }

  return res.json();
}

}