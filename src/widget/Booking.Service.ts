import { BookingModel } from "./Booking.Model";
import { ApiResponse } from "../shared/models/apiResponse.Model";

const API_BASE_URL = 'http://localhost/api-php';

export class BookingService {
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

}
