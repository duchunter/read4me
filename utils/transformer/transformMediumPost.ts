// Transform medium formated json to app format.
// The file must already hold segments; see docs/json-format.md

const isString = (value: unknown): value is string => typeof value === 'string';

// Returns why the segment is invalid, or undefined if it is fine
function checkSegment(segment: any): string | undefined {
  if (typeof segment !== 'object' || segment === null || Array.isArray(segment)) {
    return 'is not an object';
  }

  const { text, img, files } = segment;
  if (text === undefined && img === undefined && files === undefined) {
    return 'has none of "text", "img" or "files"';
  }
  if (text !== undefined && !isString(text)) {
    return '"text" is not a string';
  }
  if (img !== undefined && !isString(img)) {
    return '"img" is not a string';
  }
  if (files !== undefined) {
    if (!Array.isArray(files) || files.length === 0) {
      return '"files" is not a non-empty array';
    }
    const badFile = files.findIndex(
      (file: any) =>
        typeof file !== 'object' ||
        file === null ||
        !isString(file.filename) ||
        !isString(file.language) ||
        !isString(file.content)
    );
    if (badFile !== -1) {
      return `files[${badFile}] needs string "filename", "language" and "content"`;
    }
  }
  return undefined;
}

export default function transformMediumPost(buffer: any) {
  let mediumPost;
  try {
    mediumPost = JSON.parse(buffer.toString());
  } catch {
    alert('Invalid content: the file is not valid JSON');
    return [{}];
  }

  const content = mediumPost?.content;
  if (!Array.isArray(content) || content.length === 0) {
    alert('Invalid content: expected a non-empty "content" array');
    return [{}];
  }

  for (let i = 0; i < content.length; i++) {
    const problem = checkSegment(content[i]);
    if (problem) {
      alert(`Invalid content: content[${i}] ${problem}`);
      return [{}];
    }
  }

  return content;
}
