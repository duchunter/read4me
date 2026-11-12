# JSON document format (Medium post mode)

Besides plain `.txt` files, read4me can play a `.json` file that mixes text, images and code. Text is read aloud. For an image or a code block the app announces it ("We have a picture" / "We have some code") and shows it on screen.

## How to open one

1. Open the drawer (hamburger icon) and pick **Medium post**.
2. Tap the file button and choose your `.json` file.

The mode must be set **before** you pick the file. In **Text** mode a `.json` file is read as plain text.

## Format

The file is a JSON object with a `content` array. Each item in the array is one **segment**: the unit the app speaks, shows, skips (±5) and seeks by.

```json
{
  "content": [
    { "text": "A segment that is read aloud." },
    { "img": "https://example.com/diagram.png" },
    {
      "files": [
        { "filename": "hello.ts", "language": "typescript", "content": "console.log(\"hi\");" }
      ]
    }
  ]
}
```

Other top-level keys (`title`, `author`, ...) are ignored, so you can keep metadata in the file.

### Segment types

| Key | Type | What happens |
| --- | --- | --- |
| `text` | string | Spoken with TTS and shown on screen. |
| `img` | string (image URI) | Announced as a picture and shown. `https://` URLs and `data:image/...;base64,` URIs work. Plain `http://` is blocked by Android in release builds. |
| `files` | array of `{ filename, language, content }` (all strings, at least one file) | Announced as code and shown with syntax highlighting, one block per file. `language` is a [highlight.js language name](https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md), e.g. `javascript`, `typescript`, `python`, `bash`, `json`. Case doesn't matter. |

Rules:

- **Use one kind per segment.** If a segment has more than one key, `img` wins over `files`, and `files` wins over `text`. The extra text is neither spoken nor shown. Put captions in their own `text` segment before or after the image.
- **Keep text segments short.** Unlike Text mode, the app does not split text into sentences. A segment is spoken in one go, and skipping or seeking moves whole segments. One sentence or one short paragraph per segment works best.
- **Code is not read aloud.** Only the announcement is spoken. If the reader should hear what the code does, add a `text` segment that explains it.

### Validation

When the file loads, the app checks the whole thing and refuses it with an "Invalid content" alert if:

- the file is not valid JSON,
- `content` is missing, not an array, or empty,
- a segment is not an object or has none of `text`, `img`, `files`,
- `text` or `img` is not a string,
- `files` is not a non-empty array, or a file is missing a string `filename`, `language` or `content`.

The alert names the failing item (for example `content[12] "img" is not a string`), so you can find it in your converter's output.

## Converting a document

Whatever the source (a Medium export, a Markdown file, a blog page), the conversion is the same: walk the document in order and emit one segment per piece.

| Source element | Segment |
| --- | --- |
| Heading | `{ "text": "<heading text>" }` |
| Paragraph | One `{ "text": ... }` per sentence or short paragraph |
| List | One `{ "text": ... }` per item |
| Image | `{ "img": "<absolute URL>" }`, plus a `{ "text": ... }` for its caption or alt text if it has one |
| Code block | `{ "files": [{ "filename": "...", "language": "...", "content": "..." }] }`. Make up a filename (e.g. `snippet.py`) if the source has none. Several related snippets can go in one `files` array. |
| Links, bold, inline code | Keep only the text. Markup is spoken literally. |

A minimal Markdown converter in Node, as a starting point:

```js
// node md-to-read4me.js post.md > post.json
const fs = require("fs");

const lines = fs.readFileSync(process.argv[2], "utf8").split("\n");
const content = [];
let code = null;

for (const line of lines) {
  const fence = line.match(/^```(\w*)/);
  if (fence) {
    if (code) {
      content.push({ files: [code] });
      code = null;
    } else {
      const language = fence[1] || "plaintext";
      code = { filename: `snippet.${language}`, language, content: "" };
    }
    continue;
  }
  if (code) {
    code.content += (code.content ? "\n" : "") + line;
    continue;
  }

  const img = line.match(/!\[([^\]]*)\]\(([^)\s]+)/);
  if (img) {
    content.push({ img: img[2] });
    if (img[1]) content.push({ text: img[1] });
    continue;
  }

  const text = line
    .replace(/^#+\s*|^[-*]\s+|^\d+\.\s+/, "") // heading / list markers
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")  // links -> link text
    .replace(/[*_`]/g, "")                    // emphasis, inline code
    .trim();
  if (text) {
    text.split(/(?<=[.!?])\s+/).forEach((sentence) => content.push({ text: sentence }));
  }
}

console.log(JSON.stringify({ content }, null, 2));
```

You can also hand an article to an LLM with this page as the spec and ask it to produce the JSON.

## Example

[`examples/sample-post.json`](examples/sample-post.json) uses all three segment types. Copy it to your phone to try the mode.
