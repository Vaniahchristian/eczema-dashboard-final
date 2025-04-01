# Patient Management API Documentation

This document outlines all the API endpoints related to patient management in the EczemaAI platform.

## Base URL
```
/api
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Patient List Management

#### Get All Patients
```http
GET /api/patients
```

Query Parameters:
- `page` (number): Page number for pagination
- `limit` (number): Number of items per page
- `search` (string): Search term for patient name/id
- `sortBy` (string): Field to sort by
- `order` ('asc'|'desc'): Sort order

Response:
```json
{
  "patients": Patient[],
  "total": number,
  "currentPage": number
}
```

#### Create Patient
```http
POST /api/patients
```

Request Body:
```json
{
  "name": string,
  "dateOfBirth": string,
  "gender": string,
  "contactInfo": {
    "email": string,
    "phone": string,
    "address": string
  }
}
```

#### Delete Patient
```http
DELETE /api/patients/{id}
```

### Patient Profile Management

#### Get Patient Details
```http
GET /api/patients/{id}
```

Response:
```json
{
  "id": string,
  "name": string,
  "dateOfBirth": string,
  "gender": string,
  "contactInfo": {
    "email": string,
    "phone": string,
    "address": string
  },
  "registrationDate": string,
  "status": "active" | "inactive",
  "medicalHistory": MedicalHistory[],
  "allergies": string[],
  "medications": Medication[],
  "emergencyContact": ContactInfo,
  "insuranceInfo": InsuranceInfo,
  "lastVisit": string,
  "nextAppointment": string
}
```

#### Update Patient
```http
PATCH /api/patients/{id}
```

Request Body:
```json
{
  // Any patient fields that need updating
}
```

### Medical History

#### Get Patient History
```http
GET /api/patients/{id}/history
```

Response:
```json
{
  "history": MedicalHistory[]
}
```

### Appointments

#### Get Patient Appointments
```http
GET /api/patients/{id}/appointments
```

Query Parameters:
- `status` ('scheduled'|'completed'|'cancelled')
- `date` (string): ISO date string

Response:
```json
{
  "appointments": Appointment[]
}
```

### Treatment Plans

#### Get Treatment Plans
```http
GET /api/patients/{id}/treatments
```

Response:
```json
{
  "treatments": TreatmentPlan[]
}
```

#### Create Treatment Plan
```http
POST /api/patients/{id}/treatments
```

Request Body:
```json
{
  "startDate": string,
  "endDate": string,
  "medications": Medication[],
  "instructions": string
}
```

### Eczema Progress Tracking

#### Get Progress Data
```http
GET /api/patients/{id}/progress
```

Query Parameters:
- `startDate` (string): ISO date string
- `endDate` (string): ISO date string

Response:
```json
{
  "progress": EczemaProgress[]
}
```

#### Add Progress Entry
```http
POST /api/patients/{id}/progress
```

Request Body:
```json
{
  "date": string,
  "severity": number,
  "affectedAreas": string[],
  "symptoms": string[],
  "triggers": string[],
  "notes": string
}
```

### Photos & Documentation

#### Get Patient Photos
```http
GET /api/patients/{id}/photos
```

Query Parameters:
- `date` (string): ISO date string

Response:
```json
{
  "photos": Photo[]
}
```

#### Upload Photos
```http
POST /api/patients/{id}/photos
```

Request Body:
```
FormData containing photo files
```

### Clinical Notes

#### Get Notes
```http
GET /api/patients/{id}/notes
```

Response:
```json
{
  "notes": Note[]
}
```

#### Add Note
```http
POST /api/patients/{id}/notes
```

Request Body:
```json
{
  "content": string,
  "type": "clinical" | "progress" | "general"
}
```

## Type Definitions

```typescript
interface Patient {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  contactInfo: {
    email: string
    phone: string
    address: string
  }
  registrationDate: string
  status: 'active' | 'inactive'
}

interface DetailedPatient extends Patient {
  medicalHistory: MedicalHistory[]
  allergies: string[]
  medications: Medication[]
  emergencyContact: ContactInfo
  insuranceInfo?: InsuranceInfo
  lastVisit: string
  nextAppointment?: string
}

interface EczemaProgress {
  date: string
  severity: number
  affectedAreas: string[]
  symptoms: string[]
  triggers: string[]
  photos: string[]
  notes: string
}

interface TreatmentPlan {
  id: string
  startDate: string
  endDate: string
  medications: Medication[]
  instructions: string
  progress: string
  status: 'active' | 'completed' | 'discontinued'
}

interface Note {
  id: string
  date: string
  content: string
  author: string
  type: 'clinical' | 'progress' | 'general'
}
```

## Error Responses

All endpoints may return the following error responses:

```json
{
  "error": {
    "code": string,
    "message": string,
    "details": any
  }
}
```

Common error codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
