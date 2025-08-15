package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/spectrum/bus-tk-backend/handlers"
	"github.com/spectrum/bus-tk-backend/services"
)

func main() {
	// Initialize services
	locationService := services.NewLocationService()
	fareService := services.NewFareService()

	// Initialize handlers
	locationHandler := handlers.NewLocationHandler(locationService)
	fareHandler := handlers.NewFareHandler(fareService)

	// Setup routes
	setupRoutes(locationHandler, fareHandler)

	// Start server
	port := "8888"
	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("📍 Visit: http://localhost:%s", port)
	log.Printf("📋 API: http://localhost:%s/api/locations", port)
	log.Printf("🔍 Search: http://localhost:%s/api/locations/search", port)
	log.Printf("📊 Stats: http://localhost:%s/api/locations/stats", port)
	log.Printf("💰 API: http://localhost:%s/api/calculate-fare", port)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal("❌ Server failed to start:", err)
	}
}

// setupRoutes configures all the HTTP routes
func setupRoutes(locationHandler *handlers.LocationHandler, fareHandler *handlers.FareHandler) {
	// Simple HTTP handler
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello from Bus Fare Calculator Backend! v3")
	})

	// Health check endpoint
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status": "healthy", "service": "bus-tk-backend"}`)
	})

	// API routes
	http.HandleFunc("/api/locations", locationHandler.GetLocations)
	http.HandleFunc("/api/locations/search", locationHandler.SearchLocations)
	http.HandleFunc("/api/locations/stats", locationHandler.GetLocationStats)
	http.HandleFunc("/api/calculate-fare", fareHandler.CalculateFare)
}
