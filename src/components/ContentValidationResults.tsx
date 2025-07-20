import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface ValidationResult {
  plagiarism_score?: number;
  ai_content_score?: number;
  plagiarism_highlights?: Array<{
    start: number;
    end: number;
    text: string;
    confidence: number;
    source?: string;
  }>;
  ai_content_highlights?: Array<{
    sentence_index: number;
    text: string;
    confidence: number;
    reason?: string;
  }>;
  validation_status?: 'pending' | 'passed' | 'failed' | 'error';
}

interface ContentValidationResultsProps {
  validationResult: ValidationResult | null;
  isValidating: boolean;
  onRetryValidation: () => void;
}

export const ContentValidationResults: React.FC<ContentValidationResultsProps> = ({
  validationResult,
  isValidating,
  onRetryValidation
}) => {
  if (isValidating) {
    return (
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Validating Content...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Checking for plagiarism and AI-generated content. This may take a few moments.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!validationResult) {
    return null;
  }

  const { plagiarism_score, ai_content_score, plagiarism_highlights, ai_content_highlights, validation_status } = validationResult;

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'passed':
        return 'border-green-200 bg-green-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      case 'error':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const plagiarismPassed = (plagiarism_score ?? 0) <= 20;
  const aiContentPassed = (ai_content_score ?? 0) <= 30;
  const overallPassed = plagiarismPassed && aiContentPassed;

  return (
    <Card className={`${getStatusColor(validation_status)} transition-all duration-300`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(validation_status)}
          Content Validation Results
          <Badge variant={overallPassed ? 'default' : 'destructive'}>
            {overallPassed ? 'Passed' : 'Issues Found'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plagiarism Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Plagiarism Check</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${plagiarismPassed ? 'text-green-600' : 'text-red-600'}`}>
                  {plagiarism_score?.toFixed(1)}%
                </span>
                {plagiarismPassed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  plagiarismPassed ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((plagiarism_score ?? 0), 100)}%` }}
              />
            </div>
            {plagiarism_highlights && plagiarism_highlights.length > 0 && (
              <div className="text-sm text-red-600">
                {plagiarism_highlights.length} potential plagiarism issue(s) found
              </div>
            )}
          </div>

          {/* AI Content Results */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">AI Content Check</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${aiContentPassed ? 'text-green-600' : 'text-orange-600'}`}>
                  {ai_content_score?.toFixed(1)}%
                </span>
                {aiContentPassed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  aiContentPassed ? 'bg-green-500' : 'bg-orange-500'
                }`}
                style={{ width: `${Math.min((ai_content_score ?? 0), 100)}%` }}
              />
            </div>
            {ai_content_highlights && ai_content_highlights.length > 0 && (
              <div className="text-sm text-orange-600">
                {ai_content_highlights.length} potential AI-generated section(s) found
              </div>
            )}
          </div>
        </div>

        {/* Issues Summary */}
        {!overallPassed && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Issues Found:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {!plagiarismPassed && (
                <li>• Content shows potential plagiarism ({'>'}
                {plagiarism_score?.toFixed(1)}%)</li>
              )}
              {!aiContentPassed && (
                <li>• Content may be AI-generated ({'>'}
                {ai_content_score?.toFixed(1)}%)</li>
              )}
            </ul>
            <p className="text-sm text-yellow-700 mt-2">
              Please review and edit your content before proceeding with payment.
            </p>
          </div>
        )}

        {/* Success Message */}
        {overallPassed && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ Your content has passed all validation checks and is ready for submission!
            </p>
          </div>
        )}

        {validation_status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              There was an error during validation. Please try again.
            </p>
            <button 
              onClick={onRetryValidation}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Retry Validation
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};