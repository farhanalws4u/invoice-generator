export function numberToWords(number: number) {
  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const thousands = ["", "Thousand", "Million", "Billion"];

  function convertThreeDigitNumber(num) {
    let words = "";
    let hundreds = Math.floor(num / 100);
    let remainder = num % 100;

    if (hundreds > 0) {
      words += units[hundreds] + " Hundred ";
    }

    if (remainder < 10) {
      words += units[remainder];
    } else if (remainder < 20) {
      words += teens[remainder - 10];
    } else {
      words += tens[Math.floor(remainder / 10)];
      if (remainder % 10 > 0) {
        words += " " + units[remainder % 10];
      }
    }

    return words.trim();
  }

  if (number === 0) {
    return "Zero";
  }

  let index = 0;
  let words = "";

  do {
    let part = number % 1000;
    if (part !== 0) {
      let partWords = convertThreeDigitNumber(part);
      words = partWords + " " + thousands[index] + " " + words;
    }
    index++;
    number = Math.floor(number / 1000);
  } while (number > 0);

  return words.trim();
}
