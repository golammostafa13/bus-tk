package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/spectrum/bus-tk-backend/models"
	"github.com/spectrum/bus-tk-backend/services"
	"github.com/spectrum/bus-tk-backend/utils"
)

// FareHandler handles fare-related HTTP requests
type FareHandler struct {
	fareService *services.FareService
}

// NewFareHandler creates a new fare handler
func NewFareHandler(fareService *services.FareService) *FareHandler { 
	return &FareHandler{
		fareService: fareService,
	}
}

// CalculateFare handles POST /api/calculate-fare
func (h *FareHandler) CalculateFare(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	utils.SetCORSHeaders(w, "POST, OPTIONS")

	// Handle CORS preflight
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow POST method
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse request body
	var request models.FareRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Get distance between start and end locations
	distance, err := services.GetDistance(request.StartLocation, request.EndLocation)
	if err != nil {
		fmt.Printf("Distance calculation error: %v\n", err)
		// Use a default distance if calculation fails
		distance = 5.0 // Default 5km
		fmt.Printf("Using default distance: %f km\n", distance)
	}
	fmt.Println("Distance:", distance)

	// Calculate fare using service
	response, err := h.fareService.CalculateFare(request, distance)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Set response headers
	w.Header().Set("Content-Type", "application/json")

	// Encode response
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}
