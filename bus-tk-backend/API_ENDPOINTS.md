# Bus TK Backend API Endpoints

## Location Endpoints

### 1. Get All Locations

- **Endpoint**: `GET /api/locations`
- **Description**: Returns all available locations (for backward compatibility)
- **Response**: List of all locations with total count
- **Use Case**: Initial page load, showing all available locations

### 2. Search Locations (Optimized)

- **Endpoint**: `GET /api/locations/search`
- **Description**: Efficient search for location selection (start/end points)
- **Query Parameters**:
  - `q` (optional): Search query in English or Bengali
  - `lang` (optional): Language preference ("en" or "bn"), defaults to "en"
  - `limit` (optional): Maximum results to return, defaults to 20, max 100
- **Response**: Filtered locations based on search query
- **Use Case**: User typing to search and select start/end locations

### 3. Location Statistics

- **Endpoint**: `GET /api/locations/stats`
- **Description**: Returns location system statistics
- **Response**: Total count and cache status
- **Use Case**: System monitoring and debugging

## Search Algorithm Features

### Priority-Based Search

1. **Exact Matches** (Highest Priority): Locations that exactly match the query
2. **Prefix Matches** (High Priority): Locations that start with the query
3. **Contains Matches** (Lower Priority): Locations that contain the query

### Language Support

- **English**: Searches in `nameEn` field
- **Bengali**: Searches in `nameBn` field
- **Bilingual**: If no language specified, searches in both languages

### Performance Optimizations

- **In-Memory Caching**: All locations loaded once at startup
- **Efficient Algorithms**: O(n) search complexity with early termination
- **Duplicate Removal**: Automatic deduplication of results
- **Result Limiting**: Configurable result limits for better UX

## Example Usage

### Search for "Dhaka"

```
GET /api/locations/search?q=Dhaka&lang=en&limit=10
```

### Search for Bengali location

```
GET /api/locations/search?q=ঢাকা&lang=bn&limit=15
```

### Get first 20 locations (no search)

```
GET /api/locations/search?limit=20
```

## Response Format

### Search Response

```json
{
  "locations": [
    {
      "nameEn": "Dhaka",
      "nameBn": "ঢাকা",
      "lat": 23.8103,
      "lon": 90.4125
    }
  ],
  "total": 1,
  "query": "dhaka"
}
```

### Stats Response

```json
{
  "totalLocations": 2877,
  "cacheStatus": "loaded"
}
```

## Performance Benefits

1. **Fast Response**: In-memory search eliminates file I/O
2. **Smart Ranking**: Results ordered by relevance
3. **Efficient Filtering**: Early termination for exact matches
4. **Scalable**: Handles large datasets efficiently
5. **User-Friendly**: Configurable result limits prevent overwhelming results
