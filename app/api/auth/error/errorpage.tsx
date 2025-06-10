// app/auth/error/page.js
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages = {
    'Configuration': 'There is a problem with the server configuration. Contact support for help.',
    'AccessDenied': 'You do not have permission to sign in.',
    'Verification': 'The sign in link is no longer valid. It may have been used already or it may have expired.',
    'default': 'An error occurred during authentication. Please try again.',
    'OAuthCallback': 'There was a problem with the OAuth callback. Please ensure your callback URLs are properly configured.',
    'InvalidPattern': 'The string did not match the expected pattern. This is likely an issue with callback URL or app configuration.',
  };

  const errorMessage = errorMessages[error as keyof typeof errorMessages] || errorMessages['default'];
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-gray-700 mb-6">{errorMessage}</p>
          
          {/* Additional guidance based on error type */}
          {error === 'InvalidPattern' && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <p className="text-sm text-blue-800">
                This error typically occurs when there's a mismatch between your OAuth configuration 
                and callback URLs. Make sure your provider's callback URLs match exactly with 
                what's configured in your social media developer accounts.
              </p>
            </div>
          )}
          
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 mr-4">
            Return to Home
          </Link>
          <Link href="/signin" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}