package services

import (
	"encoding/json"
	"log"
	"os"
	"strings"
	"sync"

	"github.com/spectrum/bus-tk-backend/models"
)

// LocationService handles location-related business logic with efficient search
type LocationService struct {
	locations   []models.Location
	mu          sync.RWMutex
	initialized bool
}

// NewLocationService creates a new location service
func NewLocationService() *LocationService {
	service := &LocationService{}
	service.initializeLocations()
	return service
}

// initializeLocations loads and caches all locations in memory
func (s *LocationService) initializeLocations() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.initialized {
		return
	}

	jsonData, err := os.ReadFile("data/dhaka_areas.json")
	if err != nil {
		log.Fatalf("Error reading file: %v", err)
	}

	var locations []models.Location
	err = json.Unmarshal(jsonData, &locations)
	if err != nil {
		log.Fatalf("Error unmarshalling JSON: %v", err)
	}

	s.locations = locations
	s.initialized = true
	log.Printf("Loaded %d locations into memory", len(locations))
}

// GetLocations returns all locations (for backward compatibility)
func (s *LocationService) GetLocations() models.LocationsResponse {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if !s.initialized {
		s.initializeLocations()
	}

	return models.LocationsResponse{
		Locations: s.locations,
		Total:     len(s.locations),
	}
}

// SearchLocations performs an efficient search optimized for location selection
func (s *LocationService) SearchLocations(query string, language string, limit int) models.SearchResponse {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if !s.initialized {
		s.initializeLocations()
	}

	// Set default limit if not specified
	if limit <= 0 {
		limit = 20 // Default to 20 results for good UX
	}

	// If no query, return first few locations
	if strings.TrimSpace(query) == "" {
		if limit > len(s.locations) {
			limit = len(s.locations)
		}
		return models.SearchResponse{
			Locations: s.locations[:limit],
			Total:     len(s.locations),
			Query:     "",
		}
	}

	// Perform optimized search
	query = strings.ToLower(strings.TrimSpace(query))
	var results []models.Location

	// First pass: find exact and prefix matches (highest priority)
	exactMatches := s.findExactMatches(query, language)
	prefixMatches := s.findPrefixMatches(query, language)

	// Second pass: find contains matches (lower priority)
	containsMatches := s.findContainsMatches(query, language)

	// Combine results with priority ordering
	results = append(results, exactMatches...)
	results = append(results, prefixMatches...)
	results = append(results, containsMatches...)

	// Remove duplicates while preserving order
	results = s.removeDuplicates(results)

	// Limit results
	if len(results) > limit {
		results = results[:limit]
	}

	return models.SearchResponse{
		Locations: results,
		Total:     len(results),
		Query:     query,
	}
}

// findExactMatches finds locations that exactly match the query
func (s *LocationService) findExactMatches(query, language string) []models.Location {
	var matches []models.Location

	for _, location := range s.locations {
		if language == "bn" && strings.ToLower(location.NameBn) == query {
			matches = append(matches, location)
		} else if language == "en" && strings.ToLower(location.NameEn) == query {
			matches = append(matches, location)
		} else if strings.ToLower(location.NameEn) == query || strings.ToLower(location.NameBn) == query {
			matches = append(matches, location)
		}
	}

	return matches
}

// findPrefixMatches finds locations that start with the query
func (s *LocationService) findPrefixMatches(query, language string) []models.Location {
	var matches []models.Location

	for _, location := range s.locations {
		if language == "bn" && strings.HasPrefix(strings.ToLower(location.NameBn), query) {
			matches = append(matches, location)
		} else if language == "en" && strings.HasPrefix(strings.ToLower(location.NameEn), query) {
			matches = append(matches, location)
		} else if strings.HasPrefix(strings.ToLower(location.NameEn), query) || strings.HasPrefix(strings.ToLower(location.NameBn), query) {
			matches = append(matches, location)
		}
	}

	return matches
}

// findContainsMatches finds locations that contain the query
func (s *LocationService) findContainsMatches(query, language string) []models.Location {
	var matches []models.Location

	for _, location := range s.locations {
		if language == "bn" && strings.Contains(strings.ToLower(location.NameBn), query) {
			matches = append(matches, location)
		} else if language == "en" && strings.Contains(strings.ToLower(location.NameEn), query) {
			matches = append(matches, location)
		} else if strings.Contains(strings.ToLower(location.NameEn), query) || strings.Contains(strings.ToLower(location.NameBn), query) {
			matches = append(matches, location)
		}
	}

	return matches
}

// removeDuplicates removes duplicate locations while preserving order
func (s *LocationService) removeDuplicates(locations []models.Location) []models.Location {
	seen := make(map[string]bool)
	var unique []models.Location

	for _, location := range locations {
		key := location.NameEn + "|" + location.NameBn + "|" + string(rune(int(location.Lat))) + "|" + string(rune(int(location.Lon)))
		if !seen[key] {
			seen[key] = true
			unique = append(unique, location)
		}
	}

	return unique
}

// GetTotalLocations returns the total count of locations
func (s *LocationService) GetTotalLocations() int {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if !s.initialized {
		s.initializeLocations()
	}

	return len(s.locations)
}

// GetLocationByID returns a specific location by index (useful for selection)
func (s *LocationService) GetLocationByID(id int) *models.Location {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if !s.initialized {
		s.initializeLocations()
	}

	if id >= 0 && id < len(s.locations) {
		return &s.locations[id]
	}

	return nil
}
