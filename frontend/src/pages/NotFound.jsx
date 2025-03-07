import Button from '../components/common/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Not found');
  return (
    <div className="not-found">
      <p className="big-code">404</p>
      <h1>Page not found</h1>
      <p className="muted">The page you are looking for doesn’t exist or isn’t published.</p>
      <Button to="/">Back to home</Button>
    </div>
  );
}
