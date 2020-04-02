// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

package sessions

import (
	"crypto/rand"
	"io"
	"strings"
	"sync"

	mcCmd "github.com/minio/mc/cmd"
)

type Singleton struct {
	sessions map[string]*mcCmd.Config
}

var instance *Singleton
var once sync.Once

// Returns a Singleton instance that keeps the sessions
func GetInstance() *Singleton {
	once.Do(func() {
		//build sessions hash
		sessions := make(map[string]*mcCmd.Config)

		instance = &Singleton{
			sessions: sessions,
		}
	})
	return instance
}

func (s *Singleton) NewSession(cfg *mcCmd.Config) string {
	// genereate random session id
	sessionID := RandomCharString(64)
	// store the cfg under that session id
	s.sessions[sessionID] = cfg
	return sessionID
}

func (s *Singleton) ValidSession(sessionID string) bool {
	if _, ok := s.sessions[sessionID]; ok {
		return true
	}
	return false
}

// Do not use:
// https://stackoverflow.com/questions/22892120/how-to-generate-a-random-string-of-a-fixed-length-in-go
// It relies on math/rand and therefore not on a cryptographically secure RNG => It must not be used
// for access/secret keys.

// The alphabet of random character string. Each character must be unique.
//
// The RandomCharString implementation requires that: 256 / len(letters) is a natural numbers.
// For example: 256 / 64 = 4. However, 5 > 256/62 > 4 and therefore we must not use a alphabet
// of 62 characters.
// The reason is that if 256 / len(letters) is not a natural number then certain characters become
// more likely then others.
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ012345"

func RandomCharString(n int) string {
	random := make([]byte, n)
	if _, err := io.ReadFull(rand.Reader, random); err != nil {
		panic(err) // Can only happen if we would run out of entropy.
	}

	var s strings.Builder
	for _, v := range random {
		j := v % byte(len(letters))
		s.WriteByte(letters[j])
	}
	return s.String()
}
