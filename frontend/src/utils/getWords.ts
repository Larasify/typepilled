/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { type PreferenceState } from "~/context/PreferenceContext";

import english from "./static/english.json";
import englishQuotes from "./static/english_quotes.json";
const { groups, quotes } = englishQuotes;

export function getWords(preferences: PreferenceState) {
  let words = [...english.words];

  if (preferences.type === "quote") {
    if (preferences.quotelength === "all") {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      if (quote) {
        return quote.text.split(" ");
      }
    }
    const options = ["short", "medium", "long", "thicc"];

    const index = options.findIndex((x) => x === preferences.quotelength);
    const group = groups[index];
    if (!group) return words;
    const newQuotes = [...quotes].filter(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (x) => group[0]! <= x.length && x.length <= group[1]!
    );
    const quote = newQuotes[Math.floor(Math.random() * newQuotes.length)];
    if (quote) {
      return quote.text.split(" ");
    }
  }

  if (preferences.punctuation) {
    words = punctuations(words);
  }
  if (preferences.numbers) {
    words = numbersMode(words);
  }

  if (preferences.type === "words") {
    words.sort(() => Math.random() - 0.5);
    words = words.slice(0, parseInt(preferences.wordlength));
    return words;
  }
  if (preferences.type === "time") {
    words.sort(() => Math.random() - 0.5);
    words = words.slice(
      0,
      Math.max(100, Math.floor(parseInt(preferences.time) / 0.6))
    );
    return words;
  }
  return ["hey", "what"];
}

export function punctuations(words: string[]) {
  const punctuation = [",", ".", "!", "?", ";", ":", "()", "''"];
  const newWords = [...words];
  for (let i = 0; i < newWords.length; i++) {
    if (Math.random() < 0.6) {
      if (Math.random() < 0.4) {
        const r = punctuation[
          Math.floor(Math.random() * punctuation.length)
        ] as string;
        if (r === "()") {
          newWords[i] = "(" + newWords[i] + ")";
        } else if (r === "''") {
          newWords[i] = "'" + newWords[i] + "'";
        } else {
          newWords[i] = newWords[i] + r;
        }
      } else {
        newWords[i] =
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          newWords[i]!.charAt(0).toUpperCase() + newWords[i]?.slice(1);
      }
    }
  }
  return newWords;
}

export function numbersMode(words: string[]): string[] {
  let newWordsString = "";
  for (let i = 0; i < words.length; i++) {
    newWordsString += words[i];
    if (Math.random() < 0.2) {
      const numOfDigits = Math.floor(Math.random() * 3) + 1;
      const randomNumber = Math.floor(
        Math.random() * Math.pow(10, numOfDigits)
      );
      newWordsString += " " + randomNumber;
    }
    newWordsString += " ";
  }
  return newWordsString.split(" ");
}
