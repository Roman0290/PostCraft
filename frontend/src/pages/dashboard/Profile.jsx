import { useState } from 'react';
import { updateProfile } from '../../api/auth';
import { getErrorMessage, getFieldErrors } from '../../api/axios';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Profile() {
  useDocumentTitle('Profile');
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, email: user.email, bio: user.bio || '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage({});
    try {
      setUser(await updateProfile(form));
      setMessage({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setErrors(getFieldErrors(err));
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="dash-header"><h1>Profile</h1></div>
      <form className="card form-card" onSubmit={submit}>
        <Alert type={message.type}>{message.text}</Alert>
        <Input label="Name" name="name" value={form.name} onChange={set} error={errors.name} required />
        <Input label="Email" type="email" name="email" value={form.email} onChange={set} error={errors.email} required />
        <Input label="Bio" as="textarea" rows={4} name="bio" value={form.bio} onChange={set} error={errors.bio} maxLength={1000} hint="Shown on your author page" />
        <div className="form-actions"><Button type="submit" loading={saving}>Save changes</Button></div>
      </form>
    </>
  );
}
