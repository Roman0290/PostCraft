import { Link } from 'react-router-dom';
import PostMeta from './PostMeta';

export default function PostCard({ post }) {
  return (
    <article className="card post-card">
      <Link to={`/posts/${post.slug}`} className="post-card-cover" tabIndex={-1} aria-hidden="true">
        {post.cover_image_url
          ? <img src={post.cover_image_url} alt="" loading="lazy" />
          : <div className="cover-placeholder">{post.title.charAt(0)}</div>}
      </Link>
      <div className="post-card-body">
        {post.category && <Link to={`/category/${post.category.slug}`} className="badge">{post.category.name}</Link>}
        <h3 className="post-card-title"><Link to={`/posts/${post.slug}`}>{post.title}</Link></h3>
        {post.excerpt && <p className="post-card-excerpt">{post.excerpt}</p>}
        <div className="post-card-footer">
          <PostMeta post={post} avatarSize={24} />
          {post.comments_count > 0 && <span className="muted small">💬 {post.comments_count}</span>}
        </div>
      </div>
    </article>
  );
}
