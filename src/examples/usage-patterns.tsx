/**
 * Example: Using Multi-Agent System in Egypt Connect
 * 
 * These examples show different ways to use the agents depending on
 * where you are in the application (client vs server).
 */

import { useState } from 'react';

// ============================================
// ❌ DON'T DO THIS - Client Component
// ============================================

// 'use client'  // ❌ Never import multi-agent-client in client components
// import { getMultiAgentClient } from '@/lib/multi-agent-client';
// 
// export default function MyComponent() {
//   const handleClick = async () => {
//     const client = getMultiAgentClient();  // ❌ This won't work in browser
//     await client.orchestrate({ ... });
//   };
// }


// ============================================
// ✅ CORRECT - Call Your API Route from Client
// ============================================

'use client'

export default function MyComponent() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBuildFeature = async () => {
    setLoading(true);
    try {
      // Call YOUR API endpoint, which then calls the multi-agent service
      const response = await fetch('/api/agents/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskDescription: 'Add a notification system with real-time updates',
          context: {
            framework: 'Next.js',
            database: 'Prisma'
          }
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleBuildFeature} disabled={loading}>
        {loading ? 'Building...' : 'Build Feature'}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}


// ============================================
// ✅ CORRECT - Server Action (Next.js 15)
// ============================================

'use server'

export async function buildFeatureAction(taskDescription: string, context?: any) {
  // Call YOUR API endpoint from server action
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/agents/orchestrate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      taskDescription,
      context
    })
  });

  return response.json();
}

// Use in a client component:
// 'use client'
// import { buildFeatureAction } from './actions';
// 
// const result = await buildFeatureAction('Build a user dashboard');


// ============================================
// ✅ CORRECT - API Route (Server-side only)
// ============================================

// File: app/api/my-feature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getMultiAgentClient } from '@/lib/multi-agent-client';

export async function POST(request: NextRequest) {
  // ✅ This is server-side, so multi-agent-client is safe to use
  const { feature } = await request.json();

  const client = getMultiAgentClient();
  const result = await client.orchestrate({
    taskDescription: `Implement ${feature} feature`,
    context: { app: 'egypt-connect' }
  });

  return NextResponse.json(result);
}


// ============================================
// ✅ CORRECT - External Application (Direct Call)
// ============================================

// From another Node.js app or script (not in browser)
export async function externalAppExample() {
  const { createMultiAgentClient } = await import('../lib/multi-agent-client');
  
  const client = createMultiAgentClient({
    baseUrl: 'http://localhost:3001',  // Direct to multi-agent service
    apiKey: process.env.MULTI_AGENT_API_KEY,
  });

  const result = await client.orchestrate({
    taskDescription: 'Build a blog system'
  });
  
  return result;
}


// ============================================
// ✅ CORRECT - From Any External Service
// ============================================

export async function externalServiceExample() {
  // Call multi-agent service directly via HTTP (any language)
  const response = await fetch('http://localhost:3001/api/orchestrate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'your_api_key'
    },
    body: JSON.stringify({
      taskDescription: 'Create a REST API for user management',
      context: { language: 'TypeScript' }
    })
  });

  const data = await response.json();
  return data;
}


// ============================================
// 📝 SUMMARY
// ============================================

/**
 * WHERE TO USE WHAT:
 * 
 * 1. CLIENT COMPONENTS (Browser)
 *    ✅ Fetch to /api/agents/* endpoints
 *    ❌ Never import multi-agent-client
 * 
 * 2. SERVER COMPONENTS / ACTIONS
 *    ✅ Fetch to /api/agents/* endpoints
 *    ✅ Or use multi-agent-client if needed
 * 
 * 3. API ROUTES (Server-side)
 *    ✅ Import and use multi-agent-client
 *    ✅ This is the main integration point
 * 
 * 4. EXTERNAL APPS
 *    ✅ HTTP calls to multi-agent service directly
 *    ✅ Or HTTP calls to egypt-connect API
 */
