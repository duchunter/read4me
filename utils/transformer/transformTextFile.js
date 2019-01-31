// Transform basic text file to app format

export default function transformTextFile(buffer) {
  let text;
  try {
    text = buffer.toString();
  } catch (e) {
    text = undefined;
  }

  if (typeof(text) != 'string') {
    alert('Invalid content');
    return [{}];
  }

  let formatedContent = text
    .split('\n').join(' ')  // Remove all new line
    .split('. ')            // Cut into sentences (but not header eg: 1.1)
    .filter(text => text)   // Delete empty data
    .map(sentence => {
      return {
        text: sentence
      }
    });

  return formatedContent;
}
