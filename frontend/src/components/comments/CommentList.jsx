import { Link } from 'react-router-dom';
import { addComment, deleteComment, getComments } from '../../api/comments';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import { timeAgo } from '../../utils/formatDate';
import Alert from '../common/Alert';
import Avatar from '../common/Avatar';
import Loader from '../common/Loader';
import CommentForm from './CommentForm';

export default function CommentList({ slug, canComment }) {
  const { user } = useAuth();
  const { data: comments, loading, error, setData } = useFetch(() => getComments(slug), [slug, user?.id]);

  const add = async (body) => {
    const comment = await addComment(slug, body);
    setData([...(comments || []), comment]);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    await deleteComment(id);
    setData(comments.filter((c) => c.id !== id));
  };

  return (
    <section className="comments" aria-labelledby="comments-title">
      <h2 id="comments-title">Comments {comments?.length ? `(${comments.length})` : ''}</h2>

      {canComment && (user
        ? <CommentForm onSubmit={add} />
        : <p className="card muted login-prompt"><Link to="/login">Log in</Link> to join the discussion.</p>)}

      {loading && <Loader label="Loading comments…" />}
      <Alert>{error}</Alert>
      {comments?.length === 0 && <p className="muted">No comments yet. Be the first!</p>}

      <ul className="comment-list">
        {comments?.map((c) => (
          <li key={c.id} className="comment">
            <Avatar name={c.author?.name} size={34} />
            <div className="comment-content">
              <div className="comment-head">
                <strong>{c.author?.name}</strong>
                <span className="muted small">{timeAgo(c.created_at)}</span>
                {c.can_delete && <button className="link-btn danger small" onClick={() => remove(c.id)}>Delete</button>}
              </div>
              <p>{c.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
