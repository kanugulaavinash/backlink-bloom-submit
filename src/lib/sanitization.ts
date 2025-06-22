
import DOMPurify from 'dompurify';

// Configure DOMPurify for safe HTML rendering
const createSanitizer = () => {
  const sanitizer = DOMPurify;
  
  // Configure allowed tags and attributes for blog content
  const blogContentConfig = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target'],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false
  };

  // Configure for user input (more restrictive)
  const userInputConfig = {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false
  };

  return {
    // Sanitize blog content (allows more HTML)
    sanitizeBlogContent: (html: string): string => {
      return sanitizer.sanitize(html, blogContentConfig);
    },

    // Sanitize user input (very restrictive)
    sanitizeUserInput: (input: string): string => {
      return sanitizer.sanitize(input, userInputConfig);
    },

    // Sanitize plain text (strips all HTML)
    sanitizeText: (text: string): string => {
      return sanitizer.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    },

    // Safe URL validation
    sanitizeUrl: (url: string): string => {
      const allowedProtocols = ['http:', 'https:', 'mailto:'];
      try {
        const urlObj = new URL(url);
        if (allowedProtocols.includes(urlObj.protocol)) {
          return url;
        }
      } catch {
        // Invalid URL
      }
      return '#';
    }
  };
};

export const sanitizer = createSanitizer();

// Helper to safely render HTML content
export const createSafeHTML = (content: string, isUserGenerated = true) => {
  const sanitizedContent = isUserGenerated 
    ? sanitizer.sanitizeUserInput(content)
    : sanitizer.sanitizeBlogContent(content);
  
  return { __html: sanitizedContent };
};
