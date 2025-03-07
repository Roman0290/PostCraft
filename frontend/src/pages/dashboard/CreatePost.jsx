import { useNavigate } from 'react-router-dom';
import { createPost } from '../../api/posts';
import PostForm from '../../components/posts/PostForm';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function CreatePost() {
  useDocumentTitle('New post');
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const post = await createPost(values);
    navigate(`/posts/${post.slug}`);
  };

  return (
    <>
      <div className="dash-header"><h1>New post</h1></div>
      <PostForm onSubmit={onSubmit} submitLabel="Publish" />
    </>
  );
}
