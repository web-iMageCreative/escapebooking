import { BookingModel } from "./Booking.Model";
import { ApiResponse } from "../shared/models/apiResponse.Model";

const API_BASE_URL = 'http://localhost/api-php';

export class BookingService {
    static async getRoom(id: number): Promise<ApiResponse> {
        const res = await fetch(`${API_BASE_URL}/owners/widget/get.php?id=${id}`);
        
        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.message);
        }
    
        const result = await res.json();
        
        return result;
      }

    static async createBooking(data: BookingModel): Promise<ApiResponse> {
            console.log(data);
        const res = await fetch(`${API_BASE_URL}/owners/widget/create.php`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
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

    static async getHours(id_room: number, day_week: number): Promise<ApiResponse> {
        
        const res = await fetch(`${API_BASE_URL}/owners/widget/hours.php?id_room=${id_room}&day_week=${day_week}`);
    
        if (!res.ok) {
            const result = await res.json()
            throw new Error(result.message);
        }
    
        const result = await res.json();
    
        return result;
        }

}
