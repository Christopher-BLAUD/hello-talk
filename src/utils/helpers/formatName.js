/**
 * Transform the first letter of first word to uppercase
 * @param {string} str 
 * @returns {string} The word modified
 */
export const formatName = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}