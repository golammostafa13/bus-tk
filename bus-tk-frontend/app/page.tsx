'use client';

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { FareAction, FareRequest, FareResponse, FareState, InputMode } from '../types/api';
import BusTypeSelection from './compo/BusTypeSelection';
import DistanceInput from './compo/DistanceInput';
import DiscountSelection from './compo/DistanceSelection';
import ErrorMessage from './compo/ErrorMessage';
import Header from './compo/Header';
import InfoCard from './compo/InfoCard';
import ResultCard from './compo/ResultCard';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888/api';

// Location type for the API response
interface Location {
    nameEn: string;
    nameBn: string;
    lat: number;
    lon: number;
}

interface SearchResponse {
    locations: Location[];
    total: number;
    query: string;
}

const fareReducer = (state: FareState, action: FareAction): FareState => {
    switch (action.type) {
        case 'SET_START_LOCATION':
            return { ...state, startLocation: action.payload, error: null };
        case 'SET_END_LOCATION':
            return { ...state, endLocation: action.payload, error: null };
        case 'SET_DISTANCE':
            return { ...state, distance: action.payload, error: null };
        case 'SET_BUS_TYPE':
            return { ...state, busType: action.payload };
        case 'SET_DISCOUNT_TYPE':
            return { ...state, discountType: action.payload };
        case 'CALCULATE_FARE_START':
            return { ...state, isLoading: true, error: null, showResults: false };
        case 'CALCULATE_FARE_SUCCESS':
            return {
                ...state,
                isLoading: false,
                calculatedFare: action.payload.fare,
                fareDetails: action.payload,
                showResults: true,
                error: null
            };
        case 'CALCULATE_FARE_ERROR':
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                showResults: false
            };
        case 'RESET_FORM':
            return {
                startLocation: { nameEn: '', nameBn: '', lat: 0, lon: 0 },
                endLocation: { nameEn: '', nameBn: '', lat: 0, lon: 0 },
                distance: '',
                busType: 'nonAC',
                discountType: 'none',
                calculatedFare: null,
                fareDetails: null,
                showResults: false,
                isLoading: false,
                error: null
            };
        default:
            return state;
    }
};

// API Service Functions
const calculateFareAPI = async (request: FareRequest): Promise<FareResponse> => {
    const response = await fetch(`${API_BASE_URL}/calculate-fare`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to calculate fare' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

const searchLocationsAPI = async (query: string, language: string = 'en', limit: number = 20): Promise<SearchResponse> => {
    const params = new URLSearchParams();
    if (query.trim()) params.append('q', query.trim());
    params.append('lang', language);
    params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/locations/search?${params.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to search locations');
    }

    return response.json();
};

export default function BusFareCalculator() {
    const [state, dispatch] = useReducer(fareReducer, {
        startLocation: { nameEn: '', nameBn: '', lat: 0, lon: 0 },
        endLocation: { nameEn: '', nameBn: '', lat: 0, lon: 0 },
        distance: '',
        busType: 'nonAC',
        discountType: 'none',
        calculatedFare: null,
        fareDetails: null,
        showResults: false,
        isLoading: false,
        error: null
    });

    const [inputMode, setInputMode] = useState<InputMode>('locations');

    // Start location search state
    const [startSearch, setStartSearch] = useState('');
    const [startSearchResults, setStartSearchResults] = useState<Location[]>([]);
    const [showStartDropdown, setShowStartDropdown] = useState(false);
    const [isStartSearching, setIsStartSearching] = useState(false);

    // End location search state
    const [endSearch, setEndSearch] = useState('');
    const [endSearchResults, setEndSearchResults] = useState<Location[]>([]);
    const [showEndDropdown, setShowEndDropdown] = useState(false);
    const [isEndSearching, setIsEndSearching] = useState(false);

    // Focus management refs
    const startInputRef = useRef<HTMLInputElement>(null);
    const endInputRef = useRef<HTMLInputElement>(null);

    // Focus state tracking
    const [focusedInput, setFocusedInput] = useState<'start' | 'end' | null>(null);

    // Debounced search function
    const debouncedSearch = useCallback(
        (() => {
            let timeoutId: NodeJS.Timeout;
            return (query: string, searchType: 'start' | 'end') => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(async () => {
                    if (query.trim().length < 2) {
                        if (searchType === 'start') {
                            setStartSearchResults([]);
                        } else {
                            setEndSearchResults([]);
                        }
                        return;
                    }

                    try {
                        if (searchType === 'start') {
                            setIsStartSearching(true);
                        } else {
                            setIsEndSearching(true);
                        }

                        const results = await searchLocationsAPI(query, 'en', 15);

                        if (searchType === 'start') {
                            setStartSearchResults(results.locations);
                            setIsStartSearching(false);
                        } else {
                            setEndSearchResults(results.locations);
                            setIsEndSearching(false);
                        }
                    } catch (error) {
                        console.error('Search error:', error);
                        if (searchType === 'start') {
                            setStartSearchResults([]);
                            setIsStartSearching(false);
                        } else {
                            setEndSearchResults([]);
                            setIsEndSearching(false);
                        }
                    }
                }, 300); // 300ms delay
            };
        })(),
        []
    );

    // Handle start location search
    const handleStartSearch = (query: string) => {
        setStartSearch(query);
        setFocusedInput('start');
        debouncedSearch(query, 'start');
        setShowStartDropdown(true);
        setShowEndDropdown(false);
    };

    // Handle end location search
    const handleEndSearch = (query: string) => {
        setEndSearch(query);
        setFocusedInput('end');
        debouncedSearch(query, 'end');
        setShowEndDropdown(true);
        setShowStartDropdown(false);
    };

    // Select start location
    const selectStartLocation = (location: Location) => {
        dispatch({ type: 'SET_START_LOCATION', payload: location });
        setStartSearch(location.nameEn);
        setShowStartDropdown(false);
        setStartSearchResults([]);
        // Maintain focus on start input after selection
        setTimeout(() => {
            if (startInputRef.current) {
                startInputRef.current.focus();
                // Place cursor at end of text
                const length = startInputRef.current.value.length;
                startInputRef.current.setSelectionRange(length, length);
            }
        }, 0);
    };

    // Select end location
    const selectEndLocation = (location: Location) => {
        dispatch({ type: 'SET_END_LOCATION', payload: location });
        setEndSearch(location.nameEn);
        setShowEndDropdown(false);
        setEndSearchResults([]);
        // Maintain focus on end input after selection
        setTimeout(() => {
            if (endInputRef.current) {
                endInputRef.current.focus();
                // Place cursor at end of text
                const length = endInputRef.current.value.length;
                endInputRef.current.setSelectionRange(length, length);
            }
        }, 0);
    };

    // Handle input focus
    const handleStartFocus = () => {
        setFocusedInput('start');
        setShowStartDropdown(true);
        setShowEndDropdown(false);
    };

    const handleEndFocus = () => {
        setFocusedInput('end');
        setShowEndDropdown(true);
        setShowStartDropdown(false);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.location-dropdown')) {
                setShowStartDropdown(false);
                setShowEndDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Maintain focus during search operations
    useEffect(() => {
        if (isStartSearching && focusedInput === 'start') {
            const timer = setTimeout(() => {
                if (startInputRef.current && document.activeElement !== startInputRef.current) {
                    startInputRef.current.focus();
                }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isStartSearching, focusedInput]);

    useEffect(() => {
        if (isEndSearching && focusedInput === 'end') {
            const timer = setTimeout(() => {
                if (endInputRef.current && document.activeElement !== endInputRef.current) {
                    endInputRef.current.focus();
                }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isEndSearching, focusedInput]);

    // Keyboard navigation support
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                // Handle tab navigation between inputs
                if (focusedInput === 'start' && !event.shiftKey) {
                    setFocusedInput('end');
                    setTimeout(() => endInputRef.current?.focus(), 0);
                } else if (focusedInput === 'end' && event.shiftKey) {
                    setFocusedInput('start');
                    setTimeout(() => startInputRef.current?.focus(), 0);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [focusedInput]);

    const calculateFare = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate input
        if (inputMode === 'distance') {
            const distanceKm = parseFloat(state.distance) || 0;
            if (distanceKm <= 0) {
                dispatch({ type: 'CALCULATE_FARE_ERROR', payload: 'Please enter a valid distance greater than 0' });
                return;
            }
        } else {
            if (!state.startLocation.nameEn.trim() || !state.endLocation.nameEn.trim()) {
                dispatch({ type: 'CALCULATE_FARE_ERROR', payload: 'Please provide both start location and destination' });
                return;
            }
        }

        // Prepare API request
        const request: FareRequest = {
            busType: state.busType,
            discountType: state.discountType,
            startLocation: state.startLocation,
            endLocation: state.endLocation,
        };

        if (inputMode === 'distance') {
            request.distance = parseFloat(state.distance);
        } else {
            request.startLocation = state.startLocation;
            request.endLocation = state.endLocation;
        }

        // Start loading
        dispatch({ type: 'CALCULATE_FARE_START' });

        try {
            const fareResponse = await calculateFareAPI(request);
            dispatch({ type: 'CALCULATE_FARE_SUCCESS', payload: fareResponse });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to calculate fare. Please try again.';
            dispatch({ type: 'CALCULATE_FARE_ERROR', payload: errorMessage });
        }
    };

    const resetForm = () => {
        dispatch({ type: 'RESET_FORM' });
        setStartSearch('');
        setEndSearch('');
        setStartSearchResults([]);
        setEndSearchResults([]);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <Header />

                {/* Main Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
                    <form onSubmit={calculateFare} className="space-y-6">
                        {/* Input Mode Toggle */}
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setInputMode('locations')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${inputMode === 'locations'
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                📍 Locations
                            </button>
                            <button
                                type="button"
                                onClick={() => setInputMode('distance')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${inputMode === 'distance'
                                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                📏 Distance
                            </button>
                        </div>

                        {/* Location Inputs */}
                        {inputMode === 'locations' && (
                            <div className="space-y-4">
                                <div className="relative location-dropdown">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        🚏 Start Location
                                    </label>
                                    <div className="relative">
                                        <input
                                            ref={startInputRef}
                                            type="text"
                                            value={startSearch}
                                            onChange={(e) => handleStartSearch(e.target.value)}
                                            onFocus={handleStartFocus}
                                            placeholder="Search start location..."
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 ${focusedInput === 'start'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                            disabled={isStartSearching}
                                        />
                                        {state.startLocation.nameEn && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <span className="text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                                                    ✓ {state.startLocation.nameEn}
                                                </span>
                                            </div>
                                        )}

                                        {/* Loading indicator */}
                                        {isStartSearching && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                            </div>
                                        )}

                                        {/* Dropdown */}
                                        {showStartDropdown && startSearchResults.length > 0 && (
                                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                                {startSearchResults.map((location, index) => (
                                                    <button
                                                        key={`start-${index}-${location.nameEn}-${location.nameBn}`}
                                                        type="button"
                                                        onClick={() => selectStartLocation(location)}
                                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
                                                    >
                                                        <div className="font-medium">{location.nameEn}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {location.nameBn}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="relative location-dropdown">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        🎯 Destination
                                    </label>
                                    <div className="relative">
                                        <input
                                            ref={endInputRef}
                                            type="text"
                                            value={endSearch}
                                            onChange={(e) => handleEndSearch(e.target.value)}
                                            onFocus={handleEndFocus}
                                            placeholder="Search destination..."
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 ${focusedInput === 'end'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                            disabled={isEndSearching}
                                        />
                                        {state.endLocation.nameEn && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <span className="text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                                                    ✓ {state.endLocation.nameEn}
                                                </span>
                                            </div>
                                        )}

                                        {/* Loading indicator */}
                                        {isEndSearching && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                            </div>
                                        )}

                                        {/* Dropdown */}
                                        {showEndDropdown && endSearchResults.length > 0 && (
                                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                                {endSearchResults.map((location, index) => (
                                                    <button
                                                        key={`end-${index}-${location.nameEn}-${location.nameBn}`}
                                                        type="button"
                                                        onClick={() => selectEndLocation(location)}
                                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
                                                    >
                                                        <div className="font-medium">{location.nameEn}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {location.nameBn}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Distance Input */}
                        {inputMode === 'distance' && (
                            <DistanceInput state={state} dispatch={dispatch} />
                        )}

                        {/* Bus Type Selection */}
                        <BusTypeSelection state={state} dispatch={dispatch} />

                        {/* Discount Selection */}
                        <DiscountSelection state={state} dispatch={dispatch} />

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={state.isLoading}
                                className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${state.isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                {state.isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Calculating...
                                    </span>
                                ) : (
                                    '💰 Calculate Fare'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={state.isLoading}
                                className={`px-6 py-3 border border-gray-300 dark:border-gray-600 font-semibold rounded-lg transition-colors ${state.isLoading
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                🔄 Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/* Error Message */}
                {state.error && (
                    <ErrorMessage error={state.error} />
                )}

                {/* Results Card */}
                {state.showResults && state.calculatedFare !== null && state.fareDetails && (
                    <ResultCard state={state} inputMode={inputMode} />
                )}

                <InfoCard />
            </div>
        </main>
    );
}