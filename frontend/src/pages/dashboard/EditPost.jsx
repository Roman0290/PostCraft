import { useNavigate, useParams } from 'react-router-dom';
import { getPost, updatePost } from '../../api/posts';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import PostForm from '../../components/posts/PostForm';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useFetch from '../../hooks/useFetch';

export default function EditPost() {
  useDocumentTitle('Edit post');
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: post, loading, error } = useFetch(() => getPost(slug), [slug]);

  if (loading) return <Loader />;
  if (error) return <Alert>{error}</Alert>;
  if (!post.can_edit) return <Alert>You can only edit your own posts.</Alert>;

  const onSubmit = async (values) => {
    const updated = await updatePost(post.id, values);
    navigate(`/posts/${updated.slug}`);
  };

  return (
    <>
      <div className="dash-header"><h1>Edit post</h1></div>
      <PostForm initial={post} onSubmit={onSubmit} submitLabel={post.status === 'published' ? 'Update' : 'Publish'} />
    </>
  );
}
