const letters = 'abcdefghigklmnopqrstuvwxyz';
const capitalized = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '1234567890';

function generateId(options) {
  const {
    length,
    noNumbers,
    noLetters,
    noCapitalized
  } = options;

  var bunch = '';

  if (!noNumbers) {
    bunch += numbers;
  }

  if (!noLetters) {
    bunch += letters;
  }

  if (!noCapitalized && !noLetters) {
    bunch += capitalized;
  }

  var result = '';

  for (var i = 0; i < length; i++) {
    const index = Math.round(Math.random() * (bunch.length - 1));

    result += bunch[index];
  }

  return result;
}

export default generateId;
