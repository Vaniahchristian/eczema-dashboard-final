import axios from 'axios';

export interface Doctor {
    id: string;
    name: string;
    specialization: string;
    profileImage?: string;
    availability: boolean;
    rating?: number;
    experience?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eczema-backend.onrender.com/api';

class DoctorService {
    async getDoctors(): Promise<Doctor[]> {
        const response = await fetch(`${API_URL}/doctors`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }

    async getDoctorById(id: string): Promise<Doctor> {
        const response = await fetch(`${API_URL}/doctors/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    }
}

export const doctorService = new DoctorService();
