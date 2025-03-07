import Sidebar from '../components/layout/Sidebar';
import PostList from '../components/posts/PostList';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import usePageParam from '../hooks/usePageParam';
import Button from '../components/common/Button';

export default function Home() {
  useDocumentTitle();
  const [page, setPage] = usePageParam();
  const { user } = useAuth();

  return (
    <>
      {page === 1 && (
        <section className="hero">
          <h1>Stories, ideas &amp; tutorials</h1>
          <p>Thoughtful writing on technology, design and life, from our community of writers.</p>
          <Button to={user ? '/dashboard/posts/new' : '/register'}>{user ? 'Write a post' : 'Start writing'}</Button>
        </section>
      )}
      <div className="layout-with-sidebar">
        <div>
          <h2 className="section-title">Latest posts</h2>
          <PostList page={page} onPageChange={setPage} />
        </div>
        <Sidebar />
      </div>
    </>
  );
}
