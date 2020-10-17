class AsyncArray /*extends Array*/ {
    constructor(arr) {
        this.data = arr; // In place of Array subclassing
    }

    filterAsync(predicate) {
        // Take a copy of the array, it might mutate by the time we've finished
        const data = Array.from(this.data);
        // Transform all the elements into an array of promises using the predicate
        // as the promise
        return Promise.all(data.map((element, index) => predicate(element, index, data)))
            // Use the result of the promises to call the underlying sync filter function
            .then(result => {
                return data.filter((element, index) => {
                    return result[index];
                });
            });
    }
}

module.exports = AsyncArray;
