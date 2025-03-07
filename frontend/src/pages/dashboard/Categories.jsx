import { useState } from 'react';
import { getErrorMessage, getFieldErrors } from '../../api/axios';
import { createCategory, deleteCategory, getCategories } from '../../api/categories';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useFetch from '../../hooks/useFetch';

/** Admin-only: create and delete categories. */
export default function Categories() {
  useDocumentTitle('Categories');
  const { data: categories, loading, error, reload } = useFetch(getCategories, []);
  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      await createCategory(form);
      setForm({ name: '', description: '' });
      reload();
    } catch (err) {
      setErrors(getFieldErrors(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete “${c.name}”? Its posts will become uncategorized.`)) return;
    try {
      await deleteCategory(c.id);
      reload();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  return (
    <>
      <div className="dash-header"><h1>Categories</h1></div>

      <form className="card form-card inline-form" onSubmit={submit}>
        <Input label="Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} required />
        <Input label="Description" name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={errors.description} />
        <Button type="submit" loading={saving}>Add</Button>
      </form>

      {loading && <Loader />}
      <Alert>{error || actionError}</Alert>

      {categories?.length > 0 && (
        <div className="card table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th>Slug</th><th>Posts</th><th aria-label="Actions" /></tr></thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong>{c.description && <div className="muted small">{c.description}</div>}</td>
                  <td><code>{c.slug}</code></td>
                  <td>{c.posts_count}</td>
                  <td className="table-actions"><Button variant="ghost" size="sm" className="danger" onClick={() => remove(c)}>Delete</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
