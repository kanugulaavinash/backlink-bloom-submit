
import { Helmet } from 'react-helmet-async';

interface GoogleSearchConsoleProps {
  verificationCode?: string;
}

const GoogleSearchConsole = ({ 
  verificationCode = "your-google-search-console-verification-code" 
}: GoogleSearchConsoleProps) => {
  return (
    <Helmet>
      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content={verificationCode} />
      
      {/* Additional search engine verifications */}
      <meta name="msvalidate.01" content="your-bing-verification-code" />
      <meta name="yandex-verification" content="your-yandex-verification-code" />
    </Helmet>
  );
};

export default GoogleSearchConsole;
