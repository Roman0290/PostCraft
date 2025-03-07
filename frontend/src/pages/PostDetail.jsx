import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deletePost, getPost } from '../api/posts';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import CommentList from '../components/comments/CommentList';
import Markdown from '../components/posts/Markdown';
import PostMeta from '../components/posts/PostMeta';
import useAuth from '../hooks/useAuth';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useFetch from '../hooks/useFetch';
import NotFound from './NotFound';

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: post, loading, error, status } = useFetch(() => getPost(slug), [slug, user?.id]);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useDocumentTitle(post?.title);

  if (loading) return <Loader />;
  if (status === 404 || status === 403) return <NotFound />;
  if (error) return <Alert>{error}</Alert>;

  const onDelete = async () => {
    setDeleting(true);
    await deletePost(post.id);
    navigate('/dashboard');
  };

  return (
    <article className="post-detail">
      <header className="post-header">
        {post.category && <Link to={`/category/${post.category.slug}`} className="badge">{post.category.name}</Link>}
        {post.status === 'draft' && <span className="badge badge-warning">Draft — only you can see this</span>}
        <h1>{post.title}</h1>
        {post.excerpt && <p className="lead">{post.excerpt}</p>}
        <div className="post-header-row">
          <PostMeta post={post} avatarSize={36} />
          {post.can_edit && (
            <div className="post-actions">
              <Button to={`/dashboard/posts/${post.slug}/edit`} variant="secondary" size="sm">Edit</Button>
              <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>Delete</Button>
            </div>
          )}
        </div>
      </header>

      {post.cover_image_url && <img className="post-cover" src={post.cover_image_url} alt="" />}

      <Markdown>{post.body}</Markdown>

      {post.tags?.length > 0 && (
        <div className="tag-cloud post-tags">
          {post.tags.map((t) => <Link key={t.id} to={`/tag/${t.slug}`} className="tag">#{t.name}</Link>)}
        </div>
      )}

      <CommentList slug={post.slug} canComment={post.status === 'published'} />

      <Modal open={confirming} title="Delete this post?" confirmLabel="Delete" danger loading={deleting} onConfirm={onDelete} onClose={() => setConfirming(false)}>
        “{post.title}” and all of its comments will be permanently removed.
      </Modal>
    </article>
  );
}
