# Frontend Location Search Implementation Guide

## 🚀 **New Features Implemented**

### 1. **Efficient Location Search**

- **Debounced Search**: 300ms delay to prevent excessive API calls
- **Separate State Management**: Start and end locations have independent search states
- **Real-time Results**: Shows results as user types (minimum 2 characters)
- **Loading Indicators**: Visual feedback during search operations

### 2. **Smart Search Behavior**

- **API Integration**: Uses the new `/api/locations/search` endpoint
- **Result Limiting**: Shows maximum 15 results for better UX
- **Language Support**: Currently set to English, easily configurable
- **Error Handling**: Graceful fallback if search fails

### 3. **User Experience Improvements**

- **Dropdown Management**: Only one dropdown open at a time
- **Click Outside**: Automatically closes dropdowns
- **Selection Feedback**: Shows selected location with checkmark
- **Form Reset**: Clears all search states when resetting

## 🔧 **Technical Implementation**

### **State Management**

```typescript
// Start location search state
const [startSearch, setStartSearch] = useState("");
const [startSearchResults, setStartSearchResults] = useState<Location[]>([]);
const [showStartDropdown, setShowStartDropdown] = useState(false);
const [isStartSearching, setIsStartSearching] = useState(false);

// End location search state
const [endSearch, setEndSearch] = useState("");
const [endSearchResults, setEndSearchResults] = useState<Location[]>([]);
const [showEndDropdown, setShowEndDropdown] = useState(false);
const [isEndSearching, setIsEndSearching] = useState(false);
```

### **Debounced Search Function**

```typescript
const debouncedSearch = useCallback(
  (() => {
    let timeoutId: NodeJS.Timeout;
    return (query: string, searchType: "start" | "end") => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        // Search logic here
      }, 300); // 300ms delay
    };
  })(),
  []
);
```

### **API Integration**

```typescript
const searchLocationsAPI = async (
  query: string,
  language: string = "en",
  limit: number = 20
) => {
  const params = new URLSearchParams();
  if (query.trim()) params.append("q", query.trim());
  params.append("lang", language);
  params.append("limit", limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/locations/search?${params.toString()}`
  );
  return response.json();
};
```

## 📱 **How It Works**

### **1. User Types in Start Location**

- User starts typing in "Start Location" field
- After 300ms delay, API call is made to `/api/locations/search?q=userInput`
- Results are displayed in dropdown below the input
- Loading spinner shows during search

### **2. User Selects Start Location**

- User clicks on a location from dropdown
- Location is set in form state
- Dropdown closes
- Selected location shows with green checkmark

### **3. User Types in End Location**

- Same process for destination
- Only one dropdown can be open at a time
- Independent search states prevent conflicts

### **4. Form Submission**

- Both locations are validated
- Fare calculation proceeds with selected coordinates

## 🎨 **UI Components**

### **Search Input Fields**

- **Placeholder Text**: Clear instructions for each field
- **Focus States**: Blue ring focus indicator
- **Disabled State**: Shows loading spinner during search
- **Success State**: Green checkmark for selected locations

### **Dropdown Results**

- **Z-index**: Proper layering above other elements
- **Max Height**: Scrollable if many results
- **Hover Effects**: Visual feedback on hover
- **Bilingual Display**: Shows both English and Bengali names

### **Loading Indicators**

- **Spinner**: Animated loading indicator
- **Position**: Right-aligned in input field
- **State Management**: Independent for start/end locations

## ⚡ **Performance Optimizations**

### **1. Debouncing**

- Prevents API calls on every keystroke
- 300ms delay balances responsiveness and efficiency
- Reduces server load significantly

### **2. Result Limiting**

- Maximum 15 results shown
- Faster rendering and better UX
- Configurable via API parameters

### **3. State Isolation**

- Start and end searches are completely independent
- No unnecessary re-renders
- Efficient memory usage

### **4. API Caching**

- Backend caches all locations in memory
- Instant search results
- No file I/O on every request

## 🔍 **Search Algorithm Features**

### **Priority-Based Results**

1. **Exact Matches** (Highest Priority)
2. **Prefix Matches** (High Priority)
3. **Contains Matches** (Lower Priority)

### **Language Support**

- **English**: Primary search language
- **Bengali**: Secondary language support
- **Bilingual**: Can search in both languages

### **Smart Filtering**

- Minimum 2 characters required
- Case-insensitive search
- Automatic deduplication
- Relevance-based sorting

## 🚀 **Getting Started**

### **1. Start Backend Server**

```bash
cd bus-tk-backend
go run ./cmd/server
```

### **2. Start Frontend**

```bash
cd bus-tk-frontend
npm run dev
```

### **3. Test Search**

- Navigate to the application
- Click on "Locations" mode
- Start typing in either location field
- See real-time search results

## 🔧 **Configuration Options**

### **API Base URL**

```typescript
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888/api";
```

### **Search Parameters**

```typescript
// Debounce delay (milliseconds)
const DEBOUNCE_DELAY = 300;

// Maximum results to show
const MAX_RESULTS = 15;

// Default language
const DEFAULT_LANGUAGE = "en";
```

### **Customization**

- **Language**: Change `DEFAULT_LANGUAGE` to 'bn' for Bengali
- **Results**: Modify `MAX_RESULTS` for different dropdown sizes
- **Delay**: Adjust `DEBOUNCE_DELAY` for different responsiveness

## 🎯 **Future Enhancements**

### **1. Advanced Search**

- **Fuzzy Search**: Handle typos and partial matches
- **Recent Searches**: Cache user's recent searches
- **Favorites**: Allow users to save favorite locations

### **2. Performance**

- **Virtual Scrolling**: For very long result lists
- **Search Index**: Client-side search for instant results
- **Offline Support**: Cache results for offline use

### **3. User Experience**

- **Keyboard Navigation**: Arrow keys for dropdown navigation
- **Auto-complete**: Smart suggestions based on history
- **Voice Input**: Speech-to-text for location search

## 🐛 **Troubleshooting**

### **Common Issues**

1. **No Results**: Check if backend is running on port 8888
2. **Search Not Working**: Verify API endpoint is accessible
3. **Slow Performance**: Check network latency and backend response time
4. **Dropdown Issues**: Ensure proper z-index and positioning

### **Debug Mode**

```typescript
// Add console logs for debugging
console.log("Search query:", query);
console.log("Search results:", results);
console.log("API response:", response);
```

This implementation provides a fast, efficient, and user-friendly location search experience that integrates seamlessly with your optimized backend! 🚌✨

