const capitalizeEveryWord = (inputString: string) => {
   // Split the sentence into an array of words
   const words = inputString?.split(" ");

   // Iterate through each word in the array
   for (let i = 0; i < words.length; i++) {
       // Capitalize the first letter of each word and concatenate it with the rest of the word
       words[i] = words[i][0].toUpperCase() + words[i].substr(1);
   }

   // Join the modified array of words back into a sentence
   return words.join(" ");
}

export default capitalizeEveryWord