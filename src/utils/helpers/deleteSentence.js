import { db } from "./db";

/***
 * Delete a sentence into database
 * @param {number} sentenceId
 * @returns {Promise} Send the query to database
 */
export const deleteSentence = async (sentenceId) => {
    return await db.sentences.delete(sentenceId);
};