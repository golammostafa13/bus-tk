# API Integration Guide

## Environment Variables

Create a `.env.local` file in your project root with:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Go Backend API Contract

### POST `/api/calculate-fare`

**Request Body:**
```json
{
  "startLocation": "Mohakhali",     // Optional: for location-based calculation
  "endLocation": "Gulshan",         // Optional: for location-based calculation
  "distance": 10.5,                 // Optional: for direct distance input (in km)
  "busType": "AC",                  // Required: "AC" | "nonAC"
  "discountType": "student"         // Required: "none" | "student" | "pass"
}
```

**Response Body:**
```json
{
  "fare": 45,                       // Final calculated fare in BDT
  "distance": 10.5,                 // Distance used for calculation (in km)
  "busType": "AC",                  // Bus type used
  "discountApplied": "Student",     // Human-readable discount type
  "baseRate": 10,                   // Base rate for the bus type
  "discountPercentage": 50          // Discount percentage applied (0-100)
}
```

**Error Response:**
```json
{
  "message": "Error description"
}
```

## Frontend Features

- ✅ Real-time API integration with loading states
- ✅ Comprehensive error handling
- ✅ Form validation before API calls
- ✅ Detailed fare breakdown display
- ✅ Route visualization for location-based input
- ✅ useReducer state management for complex state
- ✅ Responsive design with dark/light mode support

## Usage

1. Start your Go backend service on port 8080
2. Start the Next.js frontend: `npm run dev`
3. The frontend will automatically connect to the backend API
4. Test fare calculations with different inputs

## API Validation

The frontend validates:
- Distance must be greater than 0 for direct distance input
- Both start and end locations must be provided for location-based input
- All required fields are present before making API calls

The backend should handle:
- Distance calculation from location names (using maps API or distance matrix)
- Fare calculation based on business rules
- Discount application
- Error responses for invalid inputs