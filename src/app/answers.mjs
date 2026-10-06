// Lenient answer checks for the locked drives in Files: a right answer written differently still
// counts (case, accents, punctuation, small typos, French / Spanish / Darija / Arabic spellings).
// ponytail: plain-text answers in the bundle, a sweet lock for A, not real security.

/** @param {string} text */
export const normalize = text => text.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
  .replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[^\p{L}\p{N}]+/gu, " ").trim();
/** @param {string} text */
const words = text => normalize(text).split(" ").filter(Boolean);

/** Edit distance, for small typos. @param {string} a @param {string} b */
export function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const kept = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = kept;
    }
  }
  return row[b.length];
}
/** A word close enough to one of the targets (1 typo per 4 letters). @param {string} word @param {string[]} targets */
const near = (word, targets) => targets.some(target => distance(word, target) <= Math.floor(target.length / 4));

const months = { april: ["april", "avril", "abril", "aprile", "apr", "avr", "ابريل", "أبريل", "نيسان", "abriil"], june: ["june", "juin", "junio", "jun", "giugno", "يونيو", "يونيه", "حزيران", "yunyu", "younyou"] };

/** @type {Record<string, (answer: string) => boolean>} */
export const checks = {
  // We met on Discord in April
  met: answer => words(answer).some(word => word === "4" || word === "04" || near(word, months.april)),
  // My birthday: June 10
  birthday: answer => {
    const list = words(answer);
    const numbers = list.filter(word => /^\d+$/.test(word)).map(Number);
    const tenth = list.some(word => ["10", "10th", "tenth", "ten", "dix", "diez", "عشرة", "عاشر", "3achra", "ashra"].includes(word) || /^10(th|e|eme|er)?$/.test(word));
    const june = list.some(word => near(word, months.june)) || (numbers.includes(6) && numbers.includes(10));
    return tenth && june;
  },
  // My favourite food is her
  food: answer => {
    const list = words(answer);
    const her = ["me", "moi", "you", "toi", "her", "elle", "ana", "nti", "nta", "انا", "أنا", "نتي", "girlfriend", "gf", "copine", "habibti", "hbibti", "myself", "a"];
    return list.length > 0 && (list.length === 1 ? her.includes(list[0]) : list.some(word => her.includes(word) && word !== "a"));
  },
  // Two to three kids
  kids: answer => words(answer).some(word => ["2", "3", "two", "three", "deux", "trois", "dos", "tres", "jouj", "jooj", "zouj", "tlata", "tlate", "اثنين", "ثلاثة", "جوج", "تلاتة", "twins"].includes(word)),
  // The cats: Argo and Themistoclis (either one counts)
  cats: answer => words(answer).some(word => near(word, ["argo", "themistoclis", "themistocles", "themistokles", "themistoklis", "themistocle"]) || word === "أرغو" || word === "ارغو"),
  // The word I keep repeating: "okoook a sahbi"
  word: answer => {
    const flat = normalize(answer).replace(/ /g, "");
    return /o+k+o*k*a?(sa+h+i*b+i+|sa7bi|sahby|saheb)/.test(flat) || words(answer).some(word => /^o+k+(o+k+)+$/.test(word) || /^o+k{2,}$/.test(word) || near(word, ["sahbi", "sa7bi", "sahby", "sahebi"]) || word === "صاحبي");
  },
};
