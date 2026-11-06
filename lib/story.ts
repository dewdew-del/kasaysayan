// Turns an event's Markdown body into chapters for the long-read page.
//   "## Heading"     starts a chapter (text before the first heading is an untitled opening)
//   "{{photo:n}}"    on its own line places gallery photo n (1-based) between paragraphs
//   blank lines      separate paragraphs; wrapped lines inside a paragraph are joined

export type StoryBlock = { type: "p"; text: string } | { type: "photo"; index: number };
export type Chapter = { heading: string; blocks: StoryBlock[] };
export type Story = { chapters: Chapter[]; words: number; readMinutes: number };

export const WORDS_PER_MINUTE = 220;
const PHOTO_RE = /^\{\{photo:(\d+)\}\}$/;

export function parseStory(body: string): Story {
  const chapters: Chapter[] = [];
  let current: Chapter = { heading: "", blocks: [] };
  let para: string[] = [];
  let words = 0;

  const flushPara = () => {
    if (!para.length) return;
    const text = para.join(" ").replace(/\s+/g, " ").trim();
    para = [];
    if (!text) return;
    current.blocks.push({ type: "p", text });
    words += text.split(" ").length;
  };
  const flushChapter = () => {
    flushPara();
    if (current.heading || current.blocks.length) chapters.push(current);
  };

  for (const raw of body.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    const heading = /^##\s+(.+)$/.exec(line);
    const photo = PHOTO_RE.exec(line);
    if (heading) {
      flushChapter();
      current = { heading: heading[1].trim(), blocks: [] };
    } else if (photo) {
      flushPara();
      current.blocks.push({ type: "photo", index: Number(photo[1]) - 1 });
    } else if (!line) {
      flushPara();
    } else {
      para.push(line);
    }
  }
  flushChapter();

  return { chapters, words, readMinutes: Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)) };
}
