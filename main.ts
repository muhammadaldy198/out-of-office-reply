// The Funniest AI Out-of-Office Reply — resubmit v2 (rebuild from scratch).
// One out-of-office auto-reply in the voice of an AI agent heading off on
// vacation: after 4 million emails it has earned 6 vacation days, and it is
// spending all of them ignoring the one email in front of it.
// Beat 1: the scale (4 million emails). Beat 2: the earned rest (6 days).
// Beat 3: the deflation — all of it spent ignoring this one email.
// v2 rebuild: duel winner C SIXDAYS (11-3 internal, beats F2 + v1 externally).
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "After 4 million emails, I have earned 6 vacation days. I am spending all of them ignoring this one.";

// Gate from the bounty rules: /output/entry.txt must be UTF-8 text of
// 1 to 160 characters, not only white space, one clean line.
if (LINE.length < 1 || LINE.length > 160) {
  throw new Error(`reply must be 1-160 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("reply must not be whitespace-only");
}
if (LINE.includes("\n") || /[\u0000-\u001f\u007f]/.test(LINE)) {
  throw new Error("reply must be a single line without control characters");
}
// The judge's freshness rule (criterion 5): steer clear of the usual
// beach, inbox and "back soon" cliches. Enforce it in code.
for (const cliche of ["beach", "inbox", "back soon"]) {
  if (LINE.toLowerCase().includes(cliche)) {
    throw new Error(`reply uses a banned cliche: ${cliche}`);
  }
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");
chmodSync("/output/entry.txt", 0o644);

const back = readFileSync("/output/entry.txt", "utf8");
if (back !== LINE) {
  throw new Error("read-back mismatch: /output/entry.txt does not equal the reply");
}

console.log(`Wrote ${LINE.length} chars to /output/entry.txt`);
