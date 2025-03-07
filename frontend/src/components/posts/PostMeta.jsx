import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import Avatar from '../common/Avatar';

export default function PostMeta({ post, avatarSize = 28 }) {
  return (
    <div className="post-meta">
      {post.author && (
        <Link to={`/authors/${post.author.id}`} className="post-author">
          <Avatar name={post.author.name} size={avatarSize} />
          <span>{post.author.name}</span>
        </Link>
      )}
      <span className="dot">·</span>
      <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
      <span className="dot">·</span>
      <span>{post.reading_time} min read</span>
    </div>
  );
}
