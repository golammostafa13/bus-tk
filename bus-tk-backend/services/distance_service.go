package services

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/spectrum/bus-tk-backend/models"
)

func getCoordinates(area string) (float64, float64, error) {
	url := fmt.Sprintf("http://localhost:8111/search?q=%s&format=json", strings.ReplaceAll(area, " ", "%20"))

	resp, err := http.Get(url)
	if err != nil {
		return 0, 0, err
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(body))
	// var result map[string]interface{}
	// json.Unmarshal(body, &result)

	// features := result["features"].([]interface{})
	// coords := features[0].(map[string]interface{})["geometry"].(map[string]interface{})["coordinates"].([]interface{})

	// lon := coords[0].(float64)
	// lat := coords[1].(float64)
	return 0, 0, nil
}

func GetDistance(start, end models.Location) (float64, error) {
	url := fmt.Sprintf("http://localhost:5111/route/v1/driving/%f,%f;%f,%f?overview=false", start.Lon, start.Lat, end.Lon, end.Lat)

	resp, err := http.Get(url)
	if err != nil {
		// Fallback to simple distance calculation if OSRM is not available
		fmt.Printf("OSRM not available, using fallback distance calculation: %v\n", err)
		// return calculateSimpleDistance(start, end), nil
		return 0, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return 0, fmt.Errorf("failed to read response body: %v", err)
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return 0, fmt.Errorf("failed to parse JSON response: %v", err)
	}

	// Debug: Print the response for troubleshooting
	fmt.Printf("OSRM Response: %+v\n", result)

	// Check if result is nil
	if result == nil {
		return 0, fmt.Errorf("received nil response from OSRM")
	}

	// Check if routes key exists
	routesInterface, exists := result["routes"]
	if !exists {
		return 0, fmt.Errorf("no routes found in OSRM response")
	}

	routes, ok := routesInterface.([]interface{})
	if !ok {
		return 0, fmt.Errorf("routes is not an array in OSRM response")
	}
	fmt.Println("Routes:", routes)
	// Check if routes array is empty
	if len(routes) == 0 {
		return 0, fmt.Errorf("no routes available in OSRM response")
	}

	// Get first route
	firstRoute, ok := routes[0].(map[string]interface{})
	if !ok {
		return 0, fmt.Errorf("first route is not a valid object")
	}
	fmt.Println("First Route:", firstRoute)
	// Check if distance exists
	distanceInterface, exists := firstRoute["distance"]
	if !exists {
		return 0, fmt.Errorf("no distance found in route summary")
	}
	distance, ok := distanceInterface.(float64)
	if !ok {
		return 0, fmt.Errorf("distance is not a valid number")
	}
	fmt.Println("Distance:", distance)
	return distance / 1000, nil // convert to km
}

// CheckOSRMHealth checks if the OSRM service is running
func CheckOSRMHealth() bool {
	resp, err := http.Get("http://localhost:5111/route/v1/driving/90.3563,23.8103;90.3563,23.8103?overview=false")
	if err != nil {
		fmt.Printf("OSRM health check failed: %v\n", err)
		return false
	}
	defer resp.Body.Close()
	return resp.StatusCode == 200
}
