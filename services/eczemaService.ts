import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getDoctorReviewedDiagnoses(doctorId: string) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/eczema/doctor/reviewed-diagnoses`, {
    params: { doctorId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
}