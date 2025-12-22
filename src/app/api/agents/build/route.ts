import { NextRequest, NextResponse } from 'next/server';
import { getMultiAgentClient } from '@/lib/multi-agent-client';

/**
 * POST /api/agents/build
 * Build a complete application using the multi-agent system
 * The system uses planner, coder, reviewer, and integrator agents
 */
export async function POST(request: NextRequest) {
  try {
    const { name, description, features, techStack, context } = await request.json();

    if (!name || !description || !features) {
      return NextResponse.json(
        { success: false, error: 'name, description, and features are required' },
        { status: 400 }
      );
    }

    console.log('🏗️  Building application:', name);

    const client = getMultiAgentClient();
    const result = await client.buildApplication({
      name,
      description,
      features,
      techStack,
      context,
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Application build error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Application build failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents/build/plan
 * Plan an application build using the planner agent
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const description = searchParams.get('description');

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'description query parameter is required' },
        { status: 400 }
      );
    }

    console.log('📋 Planning application:', description);

    const client = getMultiAgentClient();
    const result = await client.planTask(
      `Create a detailed plan for building: ${description}`,
      { planType: 'application-build' }
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('Application planning error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Application planning failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
