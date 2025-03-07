import { NavLink } from 'react-router-dom';
import { getCategories, getTags } from '../../api/categories';
import useFetch from '../../hooks/useFetch';

export default function Sidebar() {
  const categories = useFetch(getCategories, []);
  const tags = useFetch(getTags, []);

  return (
    <aside className="sidebar">
      <section className="card sidebar-section">
        <h4>Categories</h4>
        <ul className="category-list">
          {categories.data?.map((c) => (
            <li key={c.id}>
              <NavLink to={`/category/${c.slug}`}>
                <span>{c.name}</span>
                <span className="count">{c.posts_count}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </section>

      {tags.data?.length > 0 && (
        <section className="card sidebar-section">
          <h4>Tags</h4>
          <div className="tag-cloud">
            {tags.data.map((t) => (
              <NavLink key={t.id} to={`/tag/${t.slug}`} className="tag">#{t.name}</NavLink>
            ))}
          </div>
        </section>
      )}
    </aside>
  );
}
