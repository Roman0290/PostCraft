import { getPosts } from '../../api/posts';
import useFetch from '../../hooks/useFetch';
import Alert from '../common/Alert';
import EmptyState from '../common/EmptyState';
import Loader from '../common/Loader';
import Pagination from '../common/Pagination';
import PostCard from './PostCard';

/** Fetches and renders a paginated grid of posts for the given filters. */
export default function PostList({ filters = {}, page, onPageChange, emptyText = 'No posts yet.' }) {
  const key = JSON.stringify({ ...filters, page });
  const { data, loading, error } = useFetch(() => getPosts({ ...filters, page }), [key]);

  if (loading) return <Loader label="Loading posts…" />;
  if (error) return <Alert>{error}</Alert>;
  if (!data.data.length) return <EmptyState title={emptyText} />;

  return (
    <>
      <div className="post-grid">
        {data.data.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
      <Pagination
        meta={data.meta}
        onChange={(p) => { onPageChange(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      />
    </>
  );
}
