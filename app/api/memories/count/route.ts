import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET: 모든 날짜별 추억 개수 조회
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('date')

    if (error) throw error

    // 날짜별로 개수 집계
    const countMap: Record<string, number> = {}
    data?.forEach((item) => {
      countMap[item.date] = (countMap[item.date] || 0) + 1
    })

    const result = Object.entries(countMap).map(([date, count]) => ({
      date,
      count,
    }))

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('Error fetching memory counts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch memory counts' },
      { status: 500 }
    )
  }
}

