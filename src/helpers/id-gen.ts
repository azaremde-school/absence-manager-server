const letters = 'abcdefghijklmnopqrstuvwxyz';
const capitalizedLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';

interface IGenOptions {
  length: number;
  letters?: false;
  capitalizedLetters?: false;
  numbers?: false;
}

function random(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

function gen(options: IGenOptions): string {
  var result = '';

  const lettersExcluded: boolean = options.letters === false;
  const capitalizedLettersExcluded: boolean = options.capitalizedLetters === false || lettersExcluded;
  const numbersExcluded: boolean = options.numbers === false;
  
  const bunch = 
    (!lettersExcluded ? letters : '') + 
    (!capitalizedLettersExcluded ? capitalizedLetters : '') + 
    (!numbersExcluded ? numbers : '');

  for (var i = 0; i < options.length; i++) {
    const randomIndex = random(0, bunch.length);
    const randomChar: string = bunch[randomIndex];

    result += randomChar;
  }

  return result;
}

export = gen;