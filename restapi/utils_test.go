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
	"testing"

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
