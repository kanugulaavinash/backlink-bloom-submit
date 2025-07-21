import React from 'react';

interface HighlightRange {
  start: number;
  end: number;
  text: string;
  confidence: number;
  source?: string;
  reason?: string;
  type: 'plagiarism' | 'ai_content';
}

interface ContentHighlighterProps {
  content: string;
  highlights: HighlightRange[];
  className?: string;
}

export const ContentHighlighter: React.FC<ContentHighlighterProps> = ({
  content,
  highlights,
  className = ""
}) => {
  if (!highlights || highlights.length === 0) {
    return <div className={className}>{content}</div>;
  }

  // Sort highlights by start position
  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
  
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  sortedHighlights.forEach((highlight, index) => {
    // Add text before highlight
    if (highlight.start > lastIndex) {
      elements.push(
        <span key={`text-${index}`}>
          {content.slice(lastIndex, highlight.start)}
        </span>
      );
    }

    // Add highlighted text
    const highlightClass = highlight.type === 'plagiarism' 
      ? 'bg-red-200 border-l-4 border-red-500 px-1 py-0.5 relative group'
      : 'bg-orange-200 border-l-4 border-orange-500 px-1 py-0.5 relative group';

    elements.push(
      <span
        key={`highlight-${index}`}
        className={highlightClass}
        title={`${highlight.type === 'plagiarism' ? 'Potential plagiarism' : 'Potential AI content'} - Confidence: ${(highlight.confidence * 100).toFixed(1)}%`}
      >
        {highlight.text}
        {/* Tooltip */}
        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 whitespace-nowrap z-10">
          <div className="font-semibold">
            {highlight.type === 'plagiarism' ? 'Potential Plagiarism' : 'Potential AI Content'}
          </div>
          <div>Confidence: {(highlight.confidence * 100).toFixed(1)}%</div>
          {highlight.source && <div>Source: {highlight.source}</div>}
          {highlight.reason && <div>Reason: {highlight.reason}</div>}
        </div>
      </span>
    );

    lastIndex = highlight.end;
  });

  // Add remaining text
  if (lastIndex < content.length) {
    elements.push(
      <span key="text-final">
        {content.slice(lastIndex)}
      </span>
    );
  }

  return (
    <div className={`${className} relative`}>
      {elements}
      
      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
        <div className="font-medium mb-2">Validation Highlights:</div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border-l-4 border-red-500"></div>
            <span>Potential Plagiarism</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-200 border-l-4 border-orange-500"></div>
            <span>Potential AI Content</span>
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-2">
          Hover over highlighted sections for more details
        </div>
      </div>
    </div>
  );
};