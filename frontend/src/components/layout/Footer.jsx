import { APP_NAME } from '../../utils/constants';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        © {new Date().getFullYear()} {APP_NAME}. Built with React &amp; Laravel.
      </div>
    </footer>
  );
}
