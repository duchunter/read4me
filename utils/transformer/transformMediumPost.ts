// Transform medium formated json to app format

export default function transformMediumPost(buffer: any) {
  let mediumPost;
  try {
    mediumPost = JSON.parse(buffer.toString());
  } catch {
    mediumPost = undefined;
  }

  if (typeof(mediumPost) != 'object') {
    alert('Invalid content');
    return [{}];
  }
  return mediumPost.content;
}
