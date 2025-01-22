const capitalizeEachWord = (str: string): string => {
  let result = "";
  // split by " " and convert into a str into a string of words
  // capitalize the first char of each word
  // append it into a new string
  const words = str.split(" ");
  for (const word of words) {
    const firstLetterCapitalizedWord = word[0].toUpperCase() + word.slice(1);
    result = result + firstLetterCapitalizedWord;
  }

  return result;
};

export { capitalizeEachWord };
