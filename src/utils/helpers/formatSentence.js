export const formatSentence = (str, word) => {
    str === "" ? str += word : str += " " + word;

    return str;
}