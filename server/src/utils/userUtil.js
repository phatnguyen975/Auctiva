export const generateRandomPassword = () => {
  const length = 8;
  const lowerCharset = "abcdefghijklmnopqrstuvwxyz";
  const upperCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberCharset = "0123456789";
  const allCharset = lowerCharset + upperCharset + numberCharset;

  let password = "";

  password += lowerCharset.charAt(
    Math.floor(Math.random() * lowerCharset.length)
  );
  password += upperCharset.charAt(
    Math.floor(Math.random() * upperCharset.length)
  );
  password += numberCharset.charAt(
    Math.floor(Math.random() * numberCharset.length)
  );

  for (let i = 3; i < length; i++) {
    password += allCharset.charAt(
      Math.floor(Math.random() * allCharset.length)
    );
  }

  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
};
