// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

package restapi

import (
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestDifferenceArrays(t *testing.T) {
	assert := assert.New(t)
	exampleArrayAMock := []string{"a", "b", "c"}
	exampleArrayBMock := []string{"b", "d"}
	resultABArrayMock := []string{"a", "c"}
	resultBAArrayMock := []string{"d"}

	// Test-1: test DifferenceArrays() with array a vs array b
	diffArray := DifferenceArrays(exampleArrayAMock, exampleArrayBMock)
	assert.ElementsMatchf(diffArray, resultABArrayMock, "return array AB doesn't match %s")

	// Test-2: test DifferenceArrays() with array b vs array a
	diffArray2 := DifferenceArrays(exampleArrayBMock, exampleArrayAMock)
	assert.ElementsMatchf(diffArray2, resultBAArrayMock, "return array BA doesn't match %s")
}

func TestIsElementInArray(t *testing.T) {
	assert := assert.New(t)

	exampleElementsArray := []string{"c", "a", "d", "b"}

	// Test-1: test IsElementInArray() with element that is in the list
	responseArray := IsElementInArray(exampleElementsArray, "a")
	assert.Equal(true, responseArray)

	// Test-2: test IsElementInArray() with element that is not in the list
	responseArray2 := IsElementInArray(exampleElementsArray, "e")
	assert.Equal(false, responseArray2)
}

func TestUniqueKeys(t *testing.T) {
	assert := assert.New(t)

	exampleMixedArray := []string{"a", "b", "c", "e", "d", "b", "c", "h", "f", "g"}
	exampleUniqueArray := []string{"a", "b", "c", "e", "d", "h", "f", "g"}

	// Test-1 test UniqueKeys returns an array with unique elements
	responseArray := UniqueKeys(exampleMixedArray)
	assert.ElementsMatchf(responseArray, exampleUniqueArray, "returned array doesn't contain the correct elements %s")
}

func TestRandomCharStringWithAlphabet(t *testing.T) {
	type args struct {
		n        int
		alphabet string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "generated random string has the right length",
			args: args{
				n:        10,
				alphabet: "A",
			},
			want: "AAAAAAAAAA",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equalf(t, tt.want, RandomCharStringWithAlphabet(tt.args.n, tt.args.alphabet), "RandomCharStringWithAlphabet(%v, %v)", tt.args.n, tt.args.alphabet)
		})
	}
}

func TestNewSessionCookieForConsole(t *testing.T) {
	type args struct {
		token string
	}
	tests := []struct {
		name string
		args args
		want http.Cookie
	}{
		{
			name: "session cookie has the right token an security configuration",
			args: args{
				token: "jwt-xxxxxxxxx",
			},
			want: http.Cookie{
				Path:     "/",
				Value:    "jwt-xxxxxxxxx",
				HttpOnly: true,
				SameSite: http.SameSiteLaxMode,
				Name:     "token",
				MaxAge:   43200,
				Expires:  time.Now().Add(1 * time.Hour),
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := NewSessionCookieForConsole(tt.args.token)
			assert.Equalf(t, tt.want.Value, got.Value, "NewSessionCookieForConsole(%v)", tt.args.token)
			assert.Equalf(t, tt.want.Path, got.Path, "NewSessionCookieForConsole(%v)", tt.args.token)
			assert.Equalf(t, tt.want.HttpOnly, got.HttpOnly, "NewSessionCookieForConsole(%v)", tt.args.token)
			assert.Equalf(t, tt.want.Name, got.Name, "NewSessionCookieForConsole(%v)", tt.args.token)
			assert.Equalf(t, tt.want.MaxAge, got.MaxAge, "NewSessionCookieForConsole(%v)", tt.args.token)
			assert.Equalf(t, tt.want.SameSite, got.SameSite, "NewSessionCookieForConsole(%v)", tt.args.token)
		})
	}
}

func TestExpireSessionCookie(t *testing.T) {
	tests := []struct {
		name string
		want http.Cookie
	}{
		{
			name: "cookie is expired correctly",
			want: http.Cookie{
				Name:   "token",
				Value:  "",
				MaxAge: -1,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := ExpireSessionCookie()
			assert.Equalf(t, tt.want.Name, got.Name, "ExpireSessionCookie()")
			assert.Equalf(t, tt.want.Value, got.Value, "ExpireSessionCookie()")
			assert.Equalf(t, tt.want.MaxAge, got.MaxAge, "ExpireSessionCookie()")
		})
	}
}

func TestSanitizeEncodedPrefix(t *testing.T) {
	type args struct {
		rawPrefix string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "replace spaces with +",
			args: args{
				rawPrefix: "hello world",
			},
			want: "hello+world",
		},
		{
			name: "replace spaces with +",
			args: args{
				rawPrefix: "   hello-world   ",
			},
			want: "+++hello-world+++",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equalf(t, tt.want, SanitizeEncodedPrefix(tt.args.rawPrefix), "SanitizeEncodedPrefix(%v)", tt.args.rawPrefix)
		})
	}
}

func Test_isSafeToPreview(t *testing.T) {
	type args struct {
		str string
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		{
			name: "mime type is safe to preview",
			args: args{
				str: "image/jpeg",
			},
			want: true,
		},
		{
			name: "mime type is not safe to preview",
			args: args{
				str: "application/zip",
			},
			want: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equalf(t, tt.want, isSafeToPreview(tt.args.str), "isSafeToPreview(%v)", tt.args.str)
		})
	}
}

func TestRandomCharString(t *testing.T) {
	type args struct {
		n int
	}
	tests := []struct {
		name       string
		args       args
		wantLength int
	}{
		{
			name: "valid string",
			args: args{
				n: 1,
			},
			wantLength: 1,
		}, {
			name: "valid string",
			args: args{
				n: 64,
			},
			wantLength: 64,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equalf(t, tt.wantLength, len(RandomCharString(tt.args.n)), "RandomCharString(%v)", tt.args.n)
		})
	}
}
