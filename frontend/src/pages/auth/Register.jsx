import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage, getFieldErrors } from '../../api/axios';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Register() {
  useDocumentTitle('Sign up');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setError('');
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const fields = getFieldErrors(err);
      setErrors(fields);
      if (!Object.keys(fields).length) setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <h1>Create an account</h1>
        <p className="muted">Start writing in less than a minute.</p>
        <Alert>{error}</Alert>
        <Input label="Name" name="name" value={form.name} onChange={set} error={errors.name} required autoComplete="name" autoFocus />
        <Input label="Email" type="email" name="email" value={form.email} onChange={set} error={errors.email} required autoComplete="email" />
        <Input label="Password" type="password" name="password" value={form.password} onChange={set} error={errors.password} required minLength={8} autoComplete="new-password" hint="At least 8 characters" />
        <Input label="Confirm password" type="password" name="password_confirmation" value={form.password_confirmation} onChange={set} required autoComplete="new-password" />
        <Button type="submit" loading={loading} className="btn-block">Sign up</Button>
        <p className="muted small center">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
