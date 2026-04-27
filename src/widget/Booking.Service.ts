import { BookingModel } from "./Booking.Model";
import { ApiResponse } from "../shared/models/apiResponse.Model";

const API_BASE_URL = 'http://localhost/api-php';

export class BookingService {
    static async createBooking(data: BookingModel): Promise<ApiResponse> {
        const res = await fetch(`${API_BASE_URL}/owners/widget/create.php`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
    
        if (!res.ok) {
            const result = await res.json();
            console.log(result.message);
            throw new Error(result.message);
        }
    
        const result = await res.json();
        console.log(result.message);
    
        return result;
        }

    static async getHours(id_room: number, day_week: number): Promise<ApiResponse> {
        
        const res = await fetch(`${API_BASE_URL}/owners/widget/hours.php?id_room=${id_room}&day_week=${day_week}`);
    
        if (!res.ok) {
            const result = await res.json();
            throw new Error(result.message);
        }
    
        const result = await res.json();
    
        return result;
        }

    static async getAvailableHours(id_room: number, date: string): Promise<ApiResponse> {
        const res = await fetch(`${API_BASE_URL}/owners/widget/getAvailableHours.php?id_room=${id_room}&date=${date}`);

        if (!res.ok) {
            const result = await res.json();
            throw new Error(result.message);
        }
    
        const result = await res.json();
    
        return result;
    }
    
    static async getOwnerBookings(room_id: number): Promise<ApiResponse> {
        const res = await fetch(`${API_BASE_URL}/owners/widget/listBookings.php?room_id=${room_id}`);
        
        if (!res.ok) {
            const result = await res.json();
            throw new Error(result.message);
        }

        const result = await res.json();

        return result;
    }

    static async getAvailability( room_id: number, month: number | undefined, year: number | undefined ): Promise<ApiResponse> {
        const response = await fetch(`${API_BASE_URL}/owners/widget/get-availability.php?id_room=${room_id}&month=${month}&year=${year}`);
        
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message);
        }

        const result = await response.json();
        console.log(result.data);

        return result;
    }

    static async delete(id: number): Promise<ApiResponse> {
        const data = { 'id': id };
        const response = await fetch(`${API_BASE_URL}/owners/widget/delete.php`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
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
}
