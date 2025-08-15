// API Types for Bus Fare Calculator

export interface FareRequest {
    startLocation: {
        nameEn: string;
        nameBn: string;
        lat: number;
        lon: number;
    };
    endLocation: {
        nameEn: string;
        nameBn: string;
        lat: number;
        lon: number;
    };
    distance?: number;
    busType: 'nonAC' | 'AC';
    discountType: 'none' | 'student' | 'pass';
}

export interface FareResponse {
    fare: number;
    distance: number;
    busType: string;
    discountApplied: string;
    baseRate: number;
    discountPercentage: number;
}

export interface ApiError {
    message: string;
}

// Form State Types
export interface FareState {
    startLocation: {
        nameEn: string;
        nameBn: string;
        lat: number;
        lon: number;
    };
    endLocation: {
        nameEn: string;
        nameBn: string;
        lat: number;
        lon: number;
    };
    distance: string;
    busType: 'nonAC' | 'AC';
    discountType: 'none' | 'student' | 'pass';
    calculatedFare: number | null;
    fareDetails: FareResponse | null;
    showResults: boolean;
    isLoading: boolean;
    error: string | null;
}

export type FareAction =
    | { type: 'SET_START_LOCATION'; payload: { nameEn: string; nameBn: string; lat: number; lon: number } }
    | { type: 'SET_END_LOCATION'; payload: { nameEn: string; nameBn: string; lat: number; lon: number } }
    | { type: 'SET_DISTANCE'; payload: string }
    | { type: 'SET_BUS_TYPE'; payload: 'nonAC' | 'AC' }
    | { type: 'SET_DISCOUNT_TYPE'; payload: 'none' | 'student' | 'pass' }
    | { type: 'CALCULATE_FARE_START' }
    | { type: 'CALCULATE_FARE_SUCCESS'; payload: FareResponse }
    | { type: 'CALCULATE_FARE_ERROR'; payload: string }
    | { type: 'RESET_FORM' };

export type InputMode = 'locations' | 'distance';