// Self-check for the lenient drive answers: `npm run check:answers`
import assert from "node:assert/strict";
import { checks } from "../src/app/answers.mjs";

const cases = {
  met: [["April", true], ["avril", true], ["in april 2023", true], ["Aprill", true], ["4", true], ["أبريل", true], ["May", false], ["march", false], ["", false]],
  birthday: [["June 10th", true], ["10 juin", true], ["10/06", true], ["6-10", true], ["the tenth of june", true], ["Junee 10", true], ["10 يونيو", true], ["June 11", false], ["10 july", false], ["june", false]],
  food: [["me", true], ["Me!", true], ["you", true], ["it's me obviously", true], ["moi", true], ["ana", true], ["pizza", false], ["a pizza", false], ["tacos", false]],
  kids: [["2", true], ["3", true], ["2-3", true], ["two or three", true], ["jouj", true], ["deux", true], ["٣", true], ["5", false], ["one", false], ["none", false]],
  cats: [["Argo", true], ["argoo", true], ["Themistoclis", true], ["themistocles and argo", true], ["Themistokles", true], ["Felix", false], ["garfield", false]],
  word: [["okoook a sahbi", true], ["Okoook a sahbi", true], ["okok sahbi", true], ["sa7bi", true], ["okoook", true], ["ok ok", false], ["hello", false], ["yes", false]],
};
for (const [check, list] of Object.entries(cases))
  for (const [answer, expected] of list) assert.equal(checks[check](answer), expected, `${check}("${answer}") should be ${expected}`);
console.log("answers: all checks pass");
