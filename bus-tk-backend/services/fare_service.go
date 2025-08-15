package services

import (
	"fmt"

	"github.com/spectrum/bus-tk-backend/models"
)

// FareService handles fare calculation business logic
type FareService struct{}

// NewFareService creates a new fare service
func NewFareService() *FareService {
	return &FareService{}
}

// CalculateFare calculates the bus fare based on the request
func (s *FareService) CalculateFare(request models.FareRequest, distance float64) (*models.FareResponse, error) {
	// Validate request
	if err := s.validateRequest(request); err != nil {
		return nil, err
	}

	// Set defaults
	if request.BusType == "" {
		request.BusType = string(models.BusTypeNonAC)
	}
	if request.DiscountType == "" {
		request.DiscountType = string(models.DiscountTypeNone)
	}
	// Calculate fare
	fare, baseRate, discountApplied, discountPercentage := s.calculateFare(distance, request.BusType, request.DiscountType)

	response := &models.FareResponse{
		Fare:               fare,
		Distance:           distance,
		BusType:            request.BusType,
		BaseRate:           baseRate,
		DiscountApplied:    discountApplied,
		DiscountPercentage: discountPercentage,
	}

	return response, nil
}

// validateRequest validates the fare calculation request
func (s *FareService) validateRequest(request models.FareRequest) error {
	if request.Distance <= 0 && (request.StartLocation.NameEn == "" || request.EndLocation.NameEn == "") {
		return fmt.Errorf("invalid request: must provide either distance or both start and end locations")
	}
	return nil
}

// calculateFare calculates the bus fare based on distance, bus type, and discount
func (s *FareService) calculateFare(distance float64, busType, discountType string) (float64, float64, string, float64) {
	// Base rates per km
	baseRate := 12.0 // Non-AC base rate
	if busType == string(models.BusTypeAC) {
		baseRate = 18.0 // AC bus base rate
	}

	// Calculate base fare
	baseFare := distance * baseRate

	// Apply minimum fare
	if baseFare < 20.0 {
		baseFare = 20.0
	}

	// Apply discounts
	discountApplied := "None"
	discountPercentage := 0.0

	switch discountType {
	case string(models.DiscountTypeStudent):
		discountPercentage = 50.0
		discountApplied = "Student Discount"
	case string(models.DiscountTypePass):
		discountPercentage = 20.0
		discountApplied = "Monthly Pass"
	}

	// Calculate final fare
	discountAmount := baseFare * (discountPercentage / 100.0)
	finalFare := baseFare - discountAmount

	// Ensure minimum fare after discount
	if finalFare < 10.0 {
		finalFare = 10.0
	}

	return finalFare, baseFare, discountApplied, discountPercentage
}
