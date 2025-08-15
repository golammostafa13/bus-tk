# Focus Management Solution for Location Search

## 🎯 **Problem Solved**

### **Before (Issue)**

- User types in input field
- API call starts → Loading state changes → Component re-renders
- Input loses focus → Poor user experience
- User has to click back into input to continue typing

### **After (Solution)**

- User types in input field
- API call starts → Loading state changes → Component re-renders
- **Input maintains focus** → Seamless user experience
- User can continue typing without interruption

## 🔧 **Technical Implementation**

### **1. Focus State Tracking**

```typescript
// Focus management refs
const startInputRef = useRef<HTMLInputElement>(null);
const endInputRef = useRef<HTMLInputElement>(null);

// Focus state tracking
const [focusedInput, setFocusedInput] = useState<"start" | "end" | null>(null);
```

### **2. Enhanced Focus Handlers**

```typescript
// Handle input focus
const handleStartFocus = () => {
  setFocusedInput("start");
  setShowStartDropdown(true);
  setShowEndDropdown(false);
};

const handleEndFocus = () => {
  setFocusedInput("end");
  setShowEndDropdown(true);
  setShowStartDropdown(false);
};
```

### **3. Focus Preservation During Search**

```typescript
// Maintain focus during search operations
useEffect(() => {
  if (isStartSearching && focusedInput === "start") {
    const timer = setTimeout(() => {
      if (
        startInputRef.current &&
        document.activeElement !== startInputRef.current
      ) {
        startInputRef.current.focus();
      }
    }, 0);
    return () => clearTimeout(timer);
  }
}, [isStartSearching, focusedInput]);
```

### **4. Smart Selection Handling**

```typescript
// Select start location with focus preservation
const selectStartLocation = (location: Location) => {
  dispatch({ type: "SET_START_LOCATION", payload: location });
  setStartSearch(location.nameEn);
  setShowStartDropdown(false);
  setStartSearchResults([]);

  // Maintain focus and position cursor at end
  setTimeout(() => {
    if (startInputRef.current) {
      startInputRef.current.focus();
      const length = startInputRef.current.value.length;
      startInputRef.current.setSelectionRange(length, length);
    }
  }, 0);
};
```

## 🎨 **Visual Feedback**

### **Focused State Styling**

```typescript
className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 ${
    focusedInput === 'start'
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : 'border-gray-300 dark:border-gray-600'
}`}
```

### **Visual Indicators**

- **Blue border and background** when input is focused
- **Smooth transitions** with CSS animations
- **Loading spinner** shows during search without losing focus
- **Success checkmark** appears after selection

## ⌨️ **Keyboard Navigation**

### **Tab Navigation**

```typescript
// Keyboard navigation support
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      // Handle tab navigation between inputs
      if (focusedInput === "start" && !event.shiftKey) {
        setFocusedInput("end");
        setTimeout(() => endInputRef.current?.focus(), 0);
      } else if (focusedInput === "end" && event.shiftKey) {
        setFocusedInput("start");
        setTimeout(() => startInputRef.current?.focus(), 0);
      }
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [focusedInput]);
```

### **Navigation Features**

- **Tab**: Move from start to end input
- **Shift + Tab**: Move from end to start input
- **Arrow keys**: Navigate dropdown options (future enhancement)
- **Enter**: Select highlighted option (future enhancement)

## 🚀 **How It Works**

### **1. User Focuses Input**

```typescript
onFocus = { handleStartFocus };
// Sets focusedInput to 'start'
// Shows start dropdown
// Hides end dropdown
```

### **2. User Types**

```typescript
onChange={(e) => handleStartSearch(e.target.value)}
// Updates search query
// Maintains focusedInput state
// Triggers debounced search
```

### **3. Search Operation**

```typescript
// API call starts → isStartSearching = true
// Component re-renders
// useEffect detects search state change
// Restores focus if needed
```

### **4. Results Display**

```typescript
// Search completes → isStartSearching = false
// Results shown in dropdown
// Input maintains focus
// User can continue typing
```

### **5. Selection Made**

```typescript
// User clicks on result
// Location is selected
// Dropdown closes
// Focus is maintained
// Cursor positioned at end of text
```

## ⚡ **Performance Optimizations**

### **1. Debounced Search**

- **300ms delay** prevents excessive API calls
- **Focus maintained** during typing
- **Smooth user experience**

### **2. Smart Re-rendering**

- **Only necessary state changes** trigger re-renders
- **Focus state preserved** across renders
- **Efficient DOM updates**

### **3. Memory Management**

- **Proper cleanup** of event listeners
- **Timeout management** for focus operations
- **No memory leaks**

## 🐛 **Edge Cases Handled**

### **1. Rapid Typing**

- Focus maintained even with fast keystrokes
- Debouncing prevents focus loss
- Smooth transition between states

### **2. Component Re-renders**

- Focus state tracked independently
- Refs maintain element references
- useEffect ensures focus restoration

### **3. API Errors**

- Focus maintained even if search fails
- Graceful error handling
- User can retry without losing focus

### **4. Multiple Inputs**

- Only one dropdown open at a time
- Focus state properly managed
- No conflicts between inputs

## 🔍 **Debugging Tips**

### **1. Console Logging**

```typescript
// Add these logs for debugging
console.log("Focused input:", focusedInput);
console.log("Search state:", { isStartSearching, isEndSearching });
console.log("Active element:", document.activeElement);
```

### **2. Focus State Monitoring**

```typescript
// Monitor focus changes
useEffect(() => {
  console.log("Focus changed to:", focusedInput);
}, [focusedInput]);
```

### **3. Search State Monitoring**

```typescript
// Monitor search operations
useEffect(() => {
  console.log("Start search state:", isStartSearching);
}, [isStartSearching]);
```

## 🎯 **Future Enhancements**

### **1. Advanced Keyboard Navigation**

- **Arrow keys** for dropdown navigation
- **Enter** for selection
- **Escape** for closing dropdowns

### **2. Focus History**

- **Remember last focused input**
- **Restore focus after page refresh**
- **Smart focus management**

### **3. Accessibility Improvements**

- **Screen reader support**
- **ARIA labels**
- **Keyboard shortcuts**

## ✅ **Benefits Achieved**

1. **Seamless UX**: No more focus loss during search
2. **Professional Feel**: Smooth, app-like experience
3. **Accessibility**: Better keyboard navigation
4. **Performance**: Efficient focus management
5. **Maintainability**: Clean, organized code structure

This focus management solution ensures that users can search for locations without any interruption to their typing flow, providing a professional and polished user experience! 🚌✨

