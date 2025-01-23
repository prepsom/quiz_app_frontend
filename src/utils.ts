const capitalizeEachWord = (str: string): string => {
  let result = "";
  // split by " " and convert into a str into a string of words
  // capitalize the first char of each word
  // append it into a new string
  const words = str.split(" ");
  for (const word of words) {
    const firstLetterCapitalizedWord = word[0].toUpperCase() + word.slice(1);
    result = result + " " + firstLetterCapitalizedWord;
  }

  return result;
};

const validatePassword = (password: string): boolean => {
  // for a password to be valid -> strong
  // 1. length should not be less than 6 chars
  // 2. should contain atleast 1 special char
  // 3. should contain atleast 1 numerical char
  // 4. should contain atleast 1 uppercase char
  if (password.length < 6) return false;

  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const numbers = "0123456789";
  const uppercasechars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let hasSpecial = false;
  let hasNumber = false;
  let hasUppercase = false;

  for (const specialChar of specialChars) {
    if (password.includes(specialChar)) {
      hasSpecial = true;
      break;
    }
  }

  if (!hasSpecial) return false;

  for (const number of numbers) {
    if (password.includes(number)) {
      hasNumber = true;
      break;
    }
  }

  if (!hasNumber) return false;

  for (const uppercase of uppercasechars) {
    if (password.includes(uppercase)) {
      hasUppercase = true;
      break;
    }
  }

  if (!hasUppercase) return false;

  return true;
};

export { capitalizeEachWord, validatePassword };
