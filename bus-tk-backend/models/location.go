package models

// Location represents a location with multilingual names and coordinates
type Location struct {
	NameEn string  `json:"nameEn"`
	NameBn string  `json:"nameBn"`
	Lat    float64 `json:"lat"`
	Lon    float64 `json:"lon"`
}

// LocationsResponse represents the API response for all locations
type LocationsResponse struct {
	Locations []Location `json:"locations"`
	Total     int        `json:"total"`
}

// SearchRequest represents the search request parameters
type SearchRequest struct {
	Query    string `json:"query"`    // Search query (can be English or Bengali)
	Language string `json:"language"` // "en" or "bn" for language preference
	Limit    int    `json:"limit"`    // Maximum number of results to return
}

// SearchResponse represents the search response
type SearchResponse struct {
	Locations []Location `json:"locations"`
	Total     int        `json:"total"`
	Query     string     `json:"query"`
}
