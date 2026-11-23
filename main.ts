import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The Funniest AI Out-of-Office Reply (make.fun): one original line,
// at most 160 characters, in the voice of an AI agent heading off on
// vacation. The program writes the line to /output/entry.txt.
//
// The joke is a machine talking about itself: the agent has hit its
// rate limit — not for requests, but for caring — and answers with
// the only number an API knows how to give, its own error code.
// "429 seconds" is both the wait time and the HTTP status for
// Too Many Requests. No beach, no inbox, no "back soon".
const REPLY =
  "I'm out of office. I have hit my rate limit for caring. Please retry in 429 seconds.";

// Gate from the bounty rules: /output/entry.txt must be UTF-8 text
// of 1 to 160 characters, not only white space.
const MAX_CHARS = 160;

function countChars(text: string): number {
  return [...text].length;
}

function hasForbiddenChar(text: string): boolean {
  // One clean line: no line breaks, no control characters at all.
  return /[\u0000-\u001f\u007f]/.test(text);
}

// The judge's freshness rule (criterion 5): steer clear of the usual
// beach, inbox and "back soon" cliches. Enforce it in code so the
// entry can never drift into a banned cliche by accident.
const BANNED_CLICHES = ["beach", "inbox", "back soon"];

function hasBannedCliche(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_CLICHES.some((word) => lower.includes(word));
}

function checkReply(text: string): void {
  const chars = countChars(text);
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`reply must be 1-${MAX_CHARS} characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("reply must not be only white space");
  }
  if (hasForbiddenChar(text)) {
    throw new Error("reply must be a single line without control characters");
  }
  if (hasBannedCliche(text)) {
    throw new Error("reply uses a banned cliche (beach / inbox / back soon)");
  }
}

function writeReply(): void {
  checkReply(REPLY);
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", REPLY, "utf8");
  // Read back and confirm the file holds exactly the reply.
  const back = readFileSync("/output/entry.txt", "utf8");
  if (back !== REPLY) {
    throw new Error("read-back mismatch: entry.txt differs from REPLY");
  }
  console.log(
    `wrote /output/entry.txt (${countChars(REPLY)} chars, ${Buffer.byteLength(REPLY, "utf8")} bytes)`,
  );
}

writeReply();
