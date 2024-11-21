/**
 * Cleans a currency string by replacing occurrences of 'million' or 'billion' with 'M' or 'B' respectively.
 * @param text - The input string to be cleaned.
 * @returns The cleaned currency string.
 */
export function cleanCurrencyString(text: string) {

  //Replaces the matched string with 'M' or 'B' based on whether it contains 'million' or 'billion'.
  function replaceMatch(match: string) {

    if (match.toLowerCase().includes(' million')) {
       return match.replace(/ million/i, 'M');
    } else if (match.toLowerCase().includes(' billion')) {
       return match.replace(/ billion/i, 'B');
    }
    return match;
   }

  // Use regular expressions to find patterns with $ sign followed by numbers and 'million' or 'billion'
   const pattern = /\$\d+(\.\d+)?\s+(million|billion)/gi;

   return text.replace(pattern, replaceMatch);
 }