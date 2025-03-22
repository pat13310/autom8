import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  const components = {
    span: ({ node, ...props }: any) => {
      if (props.style?.color) {
        return <span style={{ color: props.style.color }}>{props.children}</span>;
      }
      return <span {...props} />;
    },
    h1: ({ node, ...props }: any) => {
      return <h1 style={props.style || {}} {...props} />;
    },
    h2: ({ node, ...props }: any) => {
      return <h2 style={props.style || {}} {...props} />;
    },
    h3: ({ node, ...props }: any) => {
      return <h3 style={props.style || {}} {...props} />;
    },
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          className="rounded-md my-4"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className={cn('prose dark:prose-invert', className)}>
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
      >
        {content || '*Aucun contenu*'}
      </ReactMarkdown>
    </div>
  );
};
