import { formatDate, getPostUrl, getPublishedPosts } from '../lib/blog';

export async function GET() {
  const posts = await getPublishedPosts();
  const index = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    url: getPostUrl(post),
    date: formatDate(post.data.pubDate),
    tags: post.data.tags,
    body: post.body,
  }));

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
