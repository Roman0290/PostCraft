import { useState } from 'react';
import { getErrorMessage } from '../../api/axios';
import Button from '../common/Button';

export default function CommentForm({ onSubmit }) {
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSaving(true);
    setError('');
    try {
      await onSubmit(body.trim());
      setBody('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={submit}>
      <textarea className="input" rows={3} placeholder="Share your thoughts…" value={body} onChange={(e) => setBody(e.target.value)} maxLength={2000} aria-label="Comment" />
      {error && <small className="error-text">{error}</small>}
      <div className="form-actions">
        <Button type="submit" size="sm" loading={saving} disabled={!body.trim()}>Post comment</Button>
      </div>
    </form>
  );
}
