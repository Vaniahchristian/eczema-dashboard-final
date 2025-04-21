# Messaging System Documentation

## Overview
The messaging system in the Eczema Dashboard allows patients to communicate with doctors in real-time. The system consists of multiple components that work together to provide a seamless messaging experience.

## Key Components

### 1. MessagesPage (`messages-page.tsx`)
The main component that orchestrates the messaging interface. It handles:
- Displaying conversations
- Showing the doctor list
- Managing real-time message updates
- Handling file attachments
- Managing typing indicators

### 2. DoctorList (`doctor-list.tsx`)
A component that displays a searchable and filterable list of doctors. Features:
- Search by name or specialty
- Filter by online status
- Shows doctor's availability status
- Displays last active time

### 3. DoctorProfile (`doctor-profile.tsx`)
Shows detailed information about a selected doctor, including:
- Professional details
- Contact information
- Qualifications
- Experience
- Actions to start chat or schedule visit

## Data Types and Interfaces

### Doctor Types
We maintain two different doctor interfaces for different purposes:

1. **DoctorList Doctor Interface**
```typescript
interface Doctor {
  id: string
  name: string
  specialty: string
  imageUrl?: string
  status: 'online' | 'offline' | 'busy'
  lastActive?: Date
}
```

2. **AppointmentService Doctor Interface**
```typescript
interface Doctor {
  id: string
  first_name: string
  last_name: string
  email: string
  role: 'doctor'
  image?: string
  doctor_profile?: {
    specialty: string
    qualifications: string
    experience_years: number
  }
}
```

## Recent Changes and Improvements

### 1. Doctor Selection Flow
- Added two-step doctor data loading:
  1. Initial list view with basic information
  2. Detailed view when a doctor is selected

### 2. Type Safety Improvements
- Separated doctor interfaces to match component needs
- Added proper type mapping between interfaces
- Implemented proper error handling with toast notifications

### 3. Data Mapping
```typescript
// Mapping from API response to DoctorList format
const mappedDoctors = data.doctors.map((doctor: any) => ({
  id: doctor.id,
  name: `${doctor.first_name} ${doctor.last_name}`,
  specialty: doctor.doctor_profile?.specialty || 'General Practice',
  imageUrl: doctor.image,
  status: 'online' as const,
  lastActive: new Date()
}))
```

### 4. API Integration
- Added doctor details fetching when selected:
```typescript
const fetchDoctorDetails = async () => {
  const response = await fetch(`${API_URL}/doctors/${doctorId}`)
  const data = await response.json()
  setSelectedDoctorDetails(data.doctor)
}
```

## WebSocket Integration

The messaging system uses WebSocket for real-time features:
- Message delivery
- Typing indicators
- Online status updates
- Read receipts

## State Management

The MessagesPage component manages several pieces of state:
```typescript
const [conversations, setConversations] = useState<Conversation[]>([])
const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
const [messages, setMessages] = useState<Message[]>([])
const [doctors, setDoctors] = useState<Doctor[]>([])
const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
const [selectedDoctorDetails, setSelectedDoctorDetails] = useState<AppointmentDoctor | null>(null)
```

## Future Improvements

1. **Real-time Status**
   - Implement actual online/offline status tracking
   - Add real last active time tracking

2. **Performance**
   - Implement pagination for doctor list and messages
   - Add message caching

3. **User Experience**
   - Add message search functionality
   - Implement message reactions
   - Add file preview for attachments

## API Endpoints

The messaging system interacts with these endpoints:

- `GET /doctors` - Get list of doctors
- `GET /doctors/:id` - Get detailed doctor information
- `GET /conversations` - Get user's conversations
- `GET /messages/:conversationId` - Get messages for a conversation
- `POST /messages` - Send a new message
- `POST /conversations` - Start a new conversation

## Error Handling

The system implements comprehensive error handling:
- Network errors
- API errors
- WebSocket connection issues
- File upload errors

Each error is caught and displayed to the user via toast notifications for a better user experience.

## Testing

To test the messaging system:
1. Ensure the backend server is running
2. Log in as a patient
3. Start a new conversation with a doctor
4. Test real-time features like typing indicators
5. Try sending different types of messages (text, files)

## Dependencies

- Socket.IO for WebSocket connections
- Shadcn UI components
- React Toast for notifications
- Lucide React for icons

## Security Considerations

1. All API requests include authentication tokens
2. File uploads are validated for size and type
3. WebSocket connections are authenticated
4. Sensitive data is not stored in local storage
