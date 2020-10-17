const splitArrays = (...arrays) => arrays.reduce((result, currentArray) => [...result, ...currentArray], [])

console.log(splitArrays([1, 2], [3, 5]));
