'use client';

import { AuthProvider } from '@/components/AuthProvider';

export default function Template({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
