# Patient Layout API Documentation

This document outlines the required APIs for the patient management section of the EczemaAI platform, based on our current implementation.

## Base URL
```
/api
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Required APIs

### 1. Patient List View (`/doctor/patients`)

#### Get Patient List
```http
GET /api/patients
```

Query Parameters:
- `page` (number): Page number for pagination
- `limit` (number): Number of items per page
- `search` (string): Search by patient name or ID
- `status` (string): Filter by status (Active/Inactive)
- `severity` (string): Filter by condition severity
- `compliance` (string): Filter by treatment compliance

Response:
```json
{
  "patients": [
    {
      "id": string,
      "name": string,
      "age": number,
      "gender": string,
      "condition": string,
      "lastVisit": string,
      "nextVisit": string,
      "status": "Active" | "Inactive",
      "severity": "Mild" | "Moderate" | "Severe",
      "compliance": "Good" | "Moderate" | "Poor",
      "alerts": number
    }
  ],
  "total": number,
  "currentPage": number,
  "totalPages": number
}
```

#### Add New Patient
```http
POST /api/patients
```

Request Body:
```json
{
  "name": string,
  "age": number,
  "gender": string,
  "email": string,
  "phone": string,
  "address": string,
  "condition": string,
  "insuranceProvider": string,
  "insuranceNumber": string,
  "emergencyContact": string,
  "allergies": string[]
}
```

### 2. Patient Profile View (`/doctor/patients/[id]`)

#### Get Patient Profile
```http
GET /api/patients/{id}
```

Response:
```json
{
  "id": string,
  "name": string,
  "age": number,
  "gender": string,
  "email": string,
  "phone": string,
  "address": string,
  "condition": string,
  "lastVisit": string,
  "nextVisit": string,
  "status": "Active" | "Inactive",
  "severity": "Mild" | "Moderate" | "Severe",
  "compliance": "Good" | "Moderate" | "Poor",
  "alerts": number,
  "doctor": string,
  "insuranceProvider": string,
  "insuranceNumber": string,
  "emergencyContact": string,
  "allergies": string[],
  "medications": {
    "name": string,
    "dosage": string,
    "status": "Active" | "Discontinued"
  }[]
}
```

#### Get Patient Treatment History
```http
GET /api/patients/{id}/treatments
```

Response:
```json
{
  "treatments": [
    {
      "date": string,
      "treatment": string,
      "description": string,
      "outcome": string,
      "doctor": string
    }
  ]
}
```

#### Get Patient Progress Data
```http
GET /api/patients/{id}/progress
```

Query Parameters:
- `startDate` (string): Start date for progress data
- `endDate` (string): End date for progress data

Response:
```json
{
  "progress": [
    {
      "date": string,
      "severity": number,
      "symptoms": string[],
      "triggers": string[],
      "notes": string
    }
  ]
}
```

#### Update Patient Medications
```http
PUT /api/patients/{id}/medications
```

Request Body:
```json
{
  "medications": [
    {
      "name": string,
      "dosage": string,
      "status": "Active" | "Discontinued"
    }
  ]
}
```

#### Add Progress Note
```http
POST /api/patients/{id}/notes
```

Request Body:
```json
{
  "note": string,
  "type": "Progress" | "Treatment" | "General",
  "date": string
}
```

## Error Responses

All endpoints may return these error responses:

```json
{
  "error": {
    "code": string,
    "message": string
  }
}
```

Common Status Codes:
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Invalid or missing token
- `404`: Not Found - Patient not found
- `500`: Internal Server Error

## Implementation Notes

1. Current Status:
   - All data is currently hardcoded in the components
   - Need to implement proper error handling
   - Need to add loading states
   - Need to implement proper data fetching with SWR or React Query

2. Priority Implementation Order:
   1. Patient List API
   2. Patient Profile API
   3. Treatment History API
   4. Progress Data API
   5. Medications Management API
   6. Notes API

3. Required Frontend Updates:
   - Add loading states
   - Implement error boundaries
   - Add proper form validation
   - Implement optimistic updates
   - Add retry logic for failed requests
