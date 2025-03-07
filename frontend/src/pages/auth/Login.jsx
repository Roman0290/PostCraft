import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage, getFieldErrors } from '../../api/axios';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import useAuth from '../../hooks/useAuth';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Login() {
  useDocumentTitle('Log in');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
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
      await login(form);
      navigate(location.state?.from || '/dashboard', { replace: true });
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
        <h1>Welcome back</h1>
        <p className="muted">Log in to write and comment.</p>
        <Alert>{error}</Alert>
        <Input label="Email" type="email" name="email" value={form.email} onChange={set} error={errors.email} required autoComplete="email" autoFocus />
        <Input label="Password" type="password" name="password" value={form.password} onChange={set} error={errors.password} required autoComplete="current-password" />
        <Button type="submit" loading={loading} className="btn-block">Log in</Button>
        <p className="muted small center">No account? <Link to="/register">Sign up</Link></p>
        <p className="demo-hint small">Demo: <code>admin@example.com</code> / <code>password</code></p>
      </form>
    </div>
  );
}
