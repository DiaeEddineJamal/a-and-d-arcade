/** Static WebP covers made by tools/cover-thumbs.py. Images never go through Vercel's image optimizer: it runs as a
 *  function and its traffic counts against the Hobby plan's 10 GB of Fast Origin Transfer. */
export const thumb = (cover: string, width: 384 | 640) => `/covers/${cover.split("/").pop()!.replace(/\.(png|svg)$/, "")}-${width}.webp`;
