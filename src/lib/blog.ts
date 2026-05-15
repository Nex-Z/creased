import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export const monthNames = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];

export async function getPublishedPosts() {
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getPostSlug(post: BlogPost) {
  return post.id.replace(/\.(md|mdx)$/i, '');
}

export function getPostUrl(post: BlogPost) {
  return `/blog/${getPostSlug(post)}/`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatShortDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}

export function estimateReadingTime(body = '') {
  const compact = body.replace(/\s+/g, '');
  const chineseChars = compact.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const latinWords = body.match(/[A-Za-z0-9_]+/g)?.length ?? 0;
  const minutes = Math.max(1, Math.ceil((chineseChars + latinWords) / 450));
  return `${minutes} 分钟`;
}

export function estimateWordCount(body = '') {
  const chineseChars = body.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const latinWords = body.match(/[A-Za-z0-9_]+/g)?.length ?? 0;
  return chineseChars + latinWords;
}

export function formatCompactNumber(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export function getAllTags(posts: BlogPost[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

export function groupPostsByArchive(posts: BlogPost[]) {
  const years = new Map<number, Map<number, BlogPost[]>>();
  for (const post of posts) {
    const year = post.data.pubDate.getFullYear();
    const month = post.data.pubDate.getMonth();
    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year)!;
    if (!months.has(month)) months.set(month, []);
    months.get(month)!.push(post);
  }

  return [...years.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, months]) => ({
      year,
      months: [...months.entries()]
        .sort(([a], [b]) => b - a)
        .map(([month, monthPosts]) => ({ month, posts: monthPosts })),
    }));
}

export function getNeighborPosts(posts: BlogPost[], current: BlogPost) {
  const index = posts.findIndex((post) => getPostSlug(post) === getPostSlug(current));
  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function getCreationDays(posts: BlogPost[]) {
  if (posts.length === 0) return 0;
  const latest = posts[0].data.pubDate.valueOf();
  const earliest = posts[posts.length - 1].data.pubDate.valueOf();
  return Math.max(1, Math.ceil((latest - earliest) / 86400000) + 1);
}
