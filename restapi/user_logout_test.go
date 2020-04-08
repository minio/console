package restapi

import (
	"testing"

	mcCmd "github.com/minio/mc/cmd"
	"github.com/minio/mcs/restapi/sessions"
)

// TestLogout tests the case of deleting a valid session id
func TestLogout(t *testing.T) {
	cfg := mcCmd.Config{}
	// Creating a new session
	sessionID := sessions.GetInstance().NewSession(&cfg)
	// Test Case 1: Delete a session Valid sessionID
	function := "logout()"
	err := logout(sessionID)
	if err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
}
