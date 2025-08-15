package models

// FareRequest represents the fare calculation request
type FareRequest struct {
	StartLocation Location  `json:"startLocation,omitempty"`
	EndLocation   Location  `json:"endLocation,omitempty"`
	Distance      float64 `json:"distance,omitempty"`
	BusType       string  `json:"busType"`
	DiscountType  string  `json:"discountType"`
}

// FareResponse represents the fare calculation response
type FareResponse struct {
	Fare               float64 `json:"fare"`
	Distance           float64 `json:"distance"`
	BusType            string  `json:"busType"`
	BaseRate           float64 `json:"baseRate"`
	DiscountApplied    string  `json:"discountApplied"`
	DiscountPercentage float64 `json:"discountPercentage"`
}

// BusType represents the type of bus
type BusType string

const (
	BusTypeNonAC BusType = "nonAC"
	BusTypeAC    BusType = "AC"
)

// DiscountType represents the type of discount
type DiscountType string

const (
	DiscountTypeNone    DiscountType = "none"
	DiscountTypeStudent DiscountType = "student"
	DiscountTypePass    DiscountType = "pass"
)
