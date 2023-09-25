import Sentence from "../../controllers/sentences";

/***
 * Delete a sentence into database
 * @param {number} sentenceId
 * @returns {Promise} Send the query to database
 */
export const deleteSentence = async (sentenceId) => {
    return await Sentence.delete(sentenceId);
};