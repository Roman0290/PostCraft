import { useState } from 'react';
import { Link } from 'react-router-dom';
import { deletePost, getMyPosts } from '../../api/posts';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useFetch from '../../hooks/useFetch';
import usePageParam from '../../hooks/usePageParam';
import { formatDate } from '../../utils/formatDate';

export default function MyPosts() {
  useDocumentTitle('My posts');
  const [page, setPage] = usePageParam();
  const { data, loading, error, reload } = useFetch(() => getMyPosts(page), [page]);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    await deletePost(toDelete.id);
    setDeleting(false);
    setToDelete(null);
    reload();
  };

  return (
    <>
      <div className="dash-header">
        <h1>My posts</h1>
        <Button to="/dashboard/posts/new">+ New post</Button>
      </div>

      {loading && <Loader />}
      <Alert>{error}</Alert>
      {data && !data.data.length && (
        <EmptyState title="You haven't written anything yet.">
          <Button to="/dashboard/posts/new">Write your first post</Button>
        </EmptyState>
      )}

      {data?.data.length > 0 && (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Status</th><th>Comments</th><th>Date</th><th aria-label="Actions" /></tr>
            </thead>
            <tbody>
              {data.data.map((post) => (
                <tr key={post.id}>
                  <td><Link to={`/posts/${post.slug}`} className="table-title">{post.title}</Link>
                    {post.category && <div className="muted small">{post.category.name}</div>}</td>
                  <td><span className={`badge ${post.status === 'draft' ? 'badge-warning' : 'badge-success'}`}>{post.status}</span></td>
                  <td>{post.comments_count}</td>
                  <td className="nowrap">{formatDate(post.published_at || post.created_at)}</td>
                  <td className="table-actions">
                    <Button to={`/dashboard/posts/${post.slug}/edit`} variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="danger" onClick={() => setToDelete(post)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination meta={data?.meta} onChange={setPage} />

      <Modal open={Boolean(toDelete)} title="Delete this post?" confirmLabel="Delete" danger loading={deleting} onConfirm={confirmDelete} onClose={() => setToDelete(null)}>
        “{toDelete?.title}” will be permanently removed.
      </Modal>
    </>
  );
}
