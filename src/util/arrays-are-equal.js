// only use this method to check for equality of arrays containing only numbers or strings

//return true if both arrays are equal

module.exports = function(array1, array2) {
    return array1.length === array2.length
        && array1.sort().every(function(value, index) { return value === array2.sort()[index]});
}
