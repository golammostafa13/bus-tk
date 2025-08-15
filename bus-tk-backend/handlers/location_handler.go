package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/spectrum/bus-tk-backend/services"
	"github.com/spectrum/bus-tk-backend/utils"
)

// LocationHandler handles location-related HTTP requests
type LocationHandler struct {
	locationService *services.LocationService
}

// NewLocationHandler creates a new location handler
func NewLocationHandler(locationService *services.LocationService) *LocationHandler {
	return &LocationHandler{
		locationService: locationService,
	}
}

// GetLocations handles GET /api/locations
func (h *LocationHandler) GetLocations(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	utils.SetCORSHeaders(w, "GET, OPTIONS")

	// Handle CORS preflight
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow GET method
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get locations from service
	response := h.locationService.GetLocations()

	// Set response headers
	w.Header().Set("Content-Type", "application/json")

	// Encode response
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

// SearchLocations handles GET /api/locations/search
func (h *LocationHandler) SearchLocations(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	utils.SetCORSHeaders(w, "GET, OPTIONS")

	// Handle CORS preflight
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow GET method
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse query parameters
	query := r.URL.Query().Get("q")
	language := r.URL.Query().Get("lang")
	limitStr := r.URL.Query().Get("limit")

	// Set default language if not specified
	if language == "" {
		language = "en"
	}

	// Validate language parameter
	if language != "en" && language != "bn" {
		language = "en"
	}

	// Parse limit parameter
	limit := 20 // Default limit
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 100 {
			limit = l
		}
	}

	// Search locations
	response := h.locationService.SearchLocations(query, language, limit)

	// Set response headers
	w.Header().Set("Content-Type", "application/json")

	// Encode response
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

// GetLocationStats handles GET /api/locations/stats
func (h *LocationHandler) GetLocationStats(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	utils.SetCORSHeaders(w, "GET, OPTIONS")

	// Handle CORS preflight
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow GET method
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get total count
	total := h.locationService.GetTotalLocations()

	// Create stats response
	stats := map[string]interface{}{
		"totalLocations": total,
		"cacheStatus":    "loaded",
	}

	// Set response headers
	w.Header().Set("Content-Type", "application/json")

	// Encode response
	if err := json.NewEncoder(w).Encode(stats); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}
