import { useParams, useSearchParams } from 'react-router-dom';
import { getAuthor } from '../api/auth';
import { getCategory } from '../api/categories';
import Avatar from '../components/common/Avatar';
import Sidebar from '../components/layout/Sidebar';
import PostList from '../components/posts/PostList';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useFetch from '../hooks/useFetch';
import usePageParam from '../hooks/usePageParam';

/** Shared layout for category, tag, author and search result pages. */
function FilteredLayout({ heading, description, filters, emptyText, children }) {
  const [page, setPage] = usePageParam();
  useDocumentTitle(heading);
  return (
    <div className="layout-with-sidebar">
      <div>
        <header className="page-header">
          {children}
          <h1>{heading}</h1>
          {description && <p className="muted">{description}</p>}
        </header>
        <PostList filters={filters} page={page} onPageChange={setPage} emptyText={emptyText} />
      </div>
      <Sidebar />
    </div>
  );
}

export function CategoryPosts() {
  const { slug } = useParams();
  const { data: category } = useFetch(() => getCategory(slug), [slug]);
  return (
    <FilteredLayout heading={category?.name || 'Category'} description={category?.description} filters={{ category: slug }} emptyText="No posts in this category yet." />
  );
}

export function TagPosts() {
  const { slug } = useParams();
  return <FilteredLayout heading={`#${slug}`} description="Posts with this tag" filters={{ tag: slug }} emptyText="No posts with this tag." />;
}

export function AuthorPosts() {
  const { id } = useParams();
  const { data: author } = useFetch(() => getAuthor(id), [id]);
  return (
    <FilteredLayout heading={author?.name || 'Author'} description={author?.bio} filters={{ author: id }} emptyText="This author hasn't published anything yet.">
      {author && <Avatar name={author.name} size={64} />}
    </FilteredLayout>
  );
}

export function SearchPosts() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  return <FilteredLayout heading={`Results for “${q}”`} filters={{ search: q }} emptyText="No posts matched your search." />;
}
