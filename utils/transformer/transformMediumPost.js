// Transform medium formated json to app format

export default function transformMediumPost(buffer) {
  let mediumPost;
  try {
    mediumPost = JSON.parse(buffer.toString());
  } catch (e) {
    mediumPost = undefined;
  }

  if (typeof(mediumPost) != 'object') {
    alert('Invalid content');
    return [{}];
  }
  return mediumPost.content;
}
