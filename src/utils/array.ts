export function arraysHaveSameValues<T>(array1: T[], array2: T[]): boolean {
	// Check if the arrays have the same length
	if (array1.length !== array2.length) {
		return false;
	}

	// Sort the arrays to ensure the values are in the same order
	const sortedArray1 = array1.slice().sort();
	const sortedArray2 = array2.slice().sort();

	// Compare each element of the sorted arrays
	for (let i = 0; i < sortedArray1.length; i++) {
		if (sortedArray1[i] !== sortedArray2[i]) {
			return false;
		}
	}

	// If all elements match, the arrays have the same values
	return true;
}
