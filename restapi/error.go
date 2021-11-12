package restapi

import (
	"errors"
	"runtime"
	"strings"

	"github.com/minio/minio-go/v7"

	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go"
)

var (
	// ErrorGeneric is a generic error message
	ErrorGeneric               = errors.New("an error occurred, please try again")
	errInvalidCredentials      = errors.New("invalid Login")
	errForbidden               = errors.New("403 Forbidden")
	errorGenericInvalidSession = errors.New("invalid session")
	// ErrorGenericNotFound Generic error for not found
	ErrorGenericNotFound = errors.New("not found")
	// Explicit error messages
	errorInvalidErasureCodingValue  = errors.New("invalid Erasure Coding Value")
	errBucketBodyNotInRequest       = errors.New("error bucket body not in request")
	errBucketNameNotInRequest       = errors.New("error bucket name not in request")
	errGroupBodyNotInRequest        = errors.New("error group body not in request")
	errGroupNameNotInRequest        = errors.New("error group name not in request")
	errPolicyNameNotInRequest       = errors.New("error policy name not in request")
	errPolicyBodyNotInRequest       = errors.New("error policy body not in request")
	errInvalidEncryptionAlgorithm   = errors.New("error invalid encryption algorithm")
	errSSENotConfigured             = errors.New("error server side encryption configuration not found")
	errBucketLifeCycleNotConfigured = errors.New("error bucket life cycle configuration not found")
	errChangePassword               = errors.New("error please check your current password")
	errInvalidLicense               = errors.New("invalid license key")
	errLicenseNotFound              = errors.New("license not found")
	errAvoidSelfAccountDelete       = errors.New("logged in user cannot be deleted by itself")
	errAccessDenied                 = errors.New("access denied")
	errOauth2Provider               = errors.New("unable to contact configured identity provider")
	errNonUniqueAccessKey           = errors.New("access key already in use")
)

// Tiering errors
var (
	errRemoteTierExists         = errors.New("Specified remote tier already exists")
	errRemoteTierNotFound       = errors.New("Specified remote tier was not found")
	errRemoteTierUppercase      = errors.New("Tier name must be in uppercase")
	errRemoteTierBucketNotFound = errors.New("Remote tier bucket not found")
	errRemoteInvalidCredentials = errors.New("Invalid remote tier credentials")
)

// prepareError receives an error object and parse it against k8sErrors, returns the right error code paired with a generic error message
func prepareError(err ...error) *models.Error {
	errorCode := int32(500)
	errorMessage := ErrorGeneric.Error()
	if len(err) > 0 {
		frame := getFrame(2)
		fileParts := strings.Split(frame.File, "/")
		LogError("original error -> (%s:%d: %v)", fileParts[len(fileParts)-1], frame.Line, err[0])
		if err[0].Error() == errForbidden.Error() {
			errorCode = 403
		}
		if err[0] == ErrorGenericNotFound {
			errorCode = 404
			errorMessage = ErrorGenericNotFound.Error()
		}
		if errors.Is(err[0], errInvalidCredentials) {
			errorCode = 401
			errorMessage = errInvalidCredentials.Error()
		}
		// console invalid erasure coding value
		if errors.Is(err[0], errorInvalidErasureCodingValue) {
			errorCode = 400
			errorMessage = errorInvalidErasureCodingValue.Error()
		}
		if errors.Is(err[0], errBucketBodyNotInRequest) {
			errorCode = 400
			errorMessage = errBucketBodyNotInRequest.Error()
		}
		if errors.Is(err[0], errBucketNameNotInRequest) {
			errorCode = 400
			errorMessage = errBucketNameNotInRequest.Error()
		}
		if errors.Is(err[0], errGroupBodyNotInRequest) {
			errorCode = 400
			errorMessage = errGroupBodyNotInRequest.Error()
		}
		if errors.Is(err[0], errGroupNameNotInRequest) {
			errorCode = 400
			errorMessage = errGroupNameNotInRequest.Error()
		}
		if errors.Is(err[0], errPolicyNameNotInRequest) {
			errorCode = 400
			errorMessage = errPolicyNameNotInRequest.Error()
		}
		if errors.Is(err[0], errPolicyBodyNotInRequest) {
			errorCode = 400
			errorMessage = errPolicyBodyNotInRequest.Error()
		}
		// console invalid session error
		if errors.Is(err[0], errorGenericInvalidSession) {
			errorCode = 401
			errorMessage = errorGenericInvalidSession.Error()
		}
		// Bucket life cycle not configured
		if errors.Is(err[0], errBucketLifeCycleNotConfigured) {
			errorCode = 404
			errorMessage = errBucketLifeCycleNotConfigured.Error()
		}
		// Encryption not configured
		if errors.Is(err[0], errSSENotConfigured) {
			errorCode = 404
			errorMessage = errSSENotConfigured.Error()
		}
		// account change password
		if madmin.ToErrorResponse(err[0]).Code == "SignatureDoesNotMatch" {
			errorCode = 403
			errorMessage = errChangePassword.Error()
		}
		if errors.Is(err[0], errLicenseNotFound) {
			errorCode = 404
			errorMessage = errLicenseNotFound.Error()
		}
		if errors.Is(err[0], errInvalidLicense) {
			errorCode = 404
			errorMessage = errInvalidLicense.Error()
		}
		if errors.Is(err[0], errAvoidSelfAccountDelete) {
			errorCode = 403
			errorMessage = errAvoidSelfAccountDelete.Error()
		}
		if madmin.ToErrorResponse(err[0]).Code == "AccessDenied" {
			errorCode = 403
			errorMessage = errAccessDenied.Error()
		}
		if madmin.ToErrorResponse(err[0]).Code == "InvalidAccessKeyId" {
			errorCode = 401
			errorMessage = errorGenericInvalidSession.Error()
		}
		// console invalid session error
		if madmin.ToErrorResponse(err[0]).Code == "XMinioAdminNoSuchUser" {
			errorCode = 401
			errorMessage = errorGenericInvalidSession.Error()
		}
		// if we received a second error take that as friendly message but don't override the code
		if len(err) > 1 && err[1] != nil {
			LogError("friendly error: %v", err[1].Error())
			errorMessage = err[1].Error()
		}
		// if we receive third error we just print that as debugging
		if len(err) > 2 && err[2] != nil {
			LogError("debugging error: %v", err[2].Error())
		}
		// tiering errors
		if err[0].Error() == errRemoteTierExists.Error() {
			errorCode = 400
			errorMessage = err[0].Error()
		}
		if err[0].Error() == errRemoteTierNotFound.Error() {
			errorCode = 400
			errorMessage = err[0].Error()
		}

		if err[0].Error() == errRemoteTierUppercase.Error() {
			errorCode = 400
			errorMessage = err[0].Error()
		}
		if err[0].Error() == errRemoteTierBucketNotFound.Error() {
			errorCode = 400
			errorMessage = err[0].Error()
		}
		if err[0].Error() == errRemoteInvalidCredentials.Error() {
			errorCode = 403
			errorMessage = err[0].Error()
		}
		// bucket already exists
		if minio.ToErrorResponse(err[0]).Code == "BucketAlreadyOwnedByYou" {
			errorCode = 400
			errorMessage = "Bucket already exists"
		}
	}
	return &models.Error{Code: errorCode, Message: swag.String(errorMessage), DetailedMessage: swag.String(err[0].Error())}
}

func getFrame(skipFrames int) runtime.Frame {
	// We need the frame at index skipFrames+2, since we never want runtime.Callers and getFrame
	targetFrameIndex := skipFrames + 2

	// Set size to targetFrameIndex+2 to ensure we have room for one more caller than we need
	programCounters := make([]uintptr, targetFrameIndex+2)
	n := runtime.Callers(0, programCounters)

	frame := runtime.Frame{Function: "unknown"}
	if n > 0 {
		frames := runtime.CallersFrames(programCounters[:n])
		for more, frameIndex := true, 0; more && frameIndex <= targetFrameIndex; frameIndex++ {
			var frameCandidate runtime.Frame
			frameCandidate, more = frames.Next()
			if frameIndex == targetFrameIndex {
				frame = frameCandidate
			}
		}
	}

	return frame
}
