import ReactMarkdown from 'react-markdown';

/** Renders post bodies. Raw HTML in markdown is ignored (safe by default). */
export default function Markdown({ children }) {
  return (
    <div className="prose">
      <ReactMarkdown
        components={{ a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" /> }}
      >
        {children || ''}
      </ReactMarkdown>
    </div>
  );
}
