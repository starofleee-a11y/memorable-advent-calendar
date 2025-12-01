import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET: 세션이 이미 업로드했는지 확인
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    )
  }

  try {
    const { data, error } = await supabase
      .from('memories')
      .select('id')
      .eq('user_session_id', sessionId)
      .limit(1)

    if (error) throw error

    return NextResponse.json({
      hasUploaded: data && data.length > 0,
    })
  } catch (error) {
    console.error('Error checking session:', error)
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    )
  }
}

