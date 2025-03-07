import { useEffect, useState } from 'react';
import { getErrorMessage, getFieldErrors } from '../../api/axios';
import { getCategories } from '../../api/categories';
import useFetch from '../../hooks/useFetch';
import Alert from '../common/Alert';
import Button from '../common/Button';
import Input from '../common/Input';
import Markdown from './Markdown';

const EMPTY = { title: '', excerpt: '', body: '', category_id: '', tags: '', status: 'draft' };

export default function PostForm({ initial, onSubmit, submitLabel = 'Save' }) {
  const categories = useFetch(getCategories, []);
  const [values, setValues] = useState(() => initial ? {
    title: initial.title,
    excerpt: initial.excerpt || '',
    body: initial.body || '',
    category_id: initial.category?.id || '',
    tags: initial.tags?.map((t) => t.name).join(', ') || '',
    status: initial.status,
  } : EMPTY);
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(initial?.cover_image_url || null);
  const [removeCover, setRemoveCover] = useState(false);
  const [tab, setTab] = useState('write');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Free the object URL created for the image preview
  useEffect(() => () => preview?.startsWith('blob:') && URL.revokeObjectURL(preview), [preview]);

  const set = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const onCover = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCover(file);
    setRemoveCover(false);
    setPreview(URL.createObjectURL(file));
  };

  const clearCover = () => {
    setCover(null);
    setPreview(null);
    setRemoveCover(true);
  };

  const submit = async (status) => {
    setSaving(true);
    setErrors({});
    setFormError('');
    try {
      await onSubmit({ ...values, status, cover_image: cover, remove_cover: initial ? removeCover : undefined });
    } catch (err) {
      setErrors(getFieldErrors(err));
      setFormError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <form className="post-form" onSubmit={(e) => { e.preventDefault(); submit(values.status); }}>
      <Alert>{formError}</Alert>

      <Input label="Title" name="title" value={values.title} onChange={set} error={errors.title} required maxLength={255} placeholder="A great headline" />

      <div className="form-row">
        <div className="field">
          <label htmlFor="category_id">Category</label>
          <select id="category_id" name="category_id" className="input" value={values.category_id} onChange={set}>
            <option value="">— None —</option>
            {categories.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.category_id && <small className="error-text">{errors.category_id}</small>}
        </div>
        <Input label="Tags" name="tags" value={values.tags} onChange={set} error={errors.tags} placeholder="react, laravel" hint="Separate tags with commas" />
      </div>

      <Input label="Excerpt" as="textarea" rows={2} name="excerpt" value={values.excerpt} onChange={set} error={errors.excerpt} maxLength={500} placeholder="A short summary shown on post cards" />

      <div className="field">
        <label>Cover image</label>
        {preview ? (
          <div className="cover-preview">
            <img src={preview} alt="Cover preview" />
            <Button type="button" variant="secondary" size="sm" onClick={clearCover}>Remove</Button>
          </div>
        ) : (
          <input type="file" accept="image/*" onChange={onCover} className="input" />
        )}
        {errors.cover_image && <small className="error-text">{errors.cover_image}</small>}
      </div>

      <div className="field">
        <div className="editor-tabs" role="tablist">
          <label htmlFor="body">Content <span className="muted small">(Markdown supported)</span></label>
          <div>
            <button type="button" role="tab" aria-selected={tab === 'write'} className={`tab ${tab === 'write' ? 'active' : ''}`} onClick={() => setTab('write')}>Write</button>
            <button type="button" role="tab" aria-selected={tab === 'preview'} className={`tab ${tab === 'preview' ? 'active' : ''}`} onClick={() => setTab('preview')}>Preview</button>
          </div>
        </div>
        {tab === 'write' ? (
          <textarea id="body" name="body" className={`input editor ${errors.body ? 'input-error' : ''}`} rows={16} value={values.body} onChange={set}
            placeholder={'## Introduction\n\nWrite your post here. **Bold**, _italic_, [links](https://example.com), lists and more.'} />
        ) : (
          <div className="editor-preview card">{values.body ? <Markdown>{values.body}</Markdown> : <p className="muted">Nothing to preview yet.</p>}</div>
        )}
        {errors.body && <small className="error-text">{errors.body}</small>}
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" loading={saving} onClick={() => submit('draft')}>Save as draft</Button>
        <Button type="button" loading={saving} onClick={() => submit('published')}>{submitLabel}</Button>
      </div>
    </form>
  );
}
