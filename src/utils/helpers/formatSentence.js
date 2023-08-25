/**
 * Make sentence with add words to existing string and put white-space between
 * @param {string} str 
 * @param {string} word 
 * @returns {string} Return the string 
 */
export const formatSentence = (str, word) => {
    str === "" ? str += word : str += " " + word;

    return str;
}