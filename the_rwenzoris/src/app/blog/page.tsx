// app/blog/page.js
import BlogSection from '../../components/BlogSection';
import { fetchBlogPosts } from '../../utils/api';

export default async function BlogPage() {
  const posts = await fetchBlogPosts();

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center my-8 text-gray-900">Travel Guides & Articles</h1>
      <BlogSection initialPosts={posts} />
    </div>
  );
}