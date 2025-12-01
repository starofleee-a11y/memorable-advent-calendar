import { NextRequest, NextResponse } from 'next/server'
import { supabase, MEMORIES_BUCKET } from '@/lib/supabase'
import { validateImageFile, validateContent } from '@/lib/utils'

// GET: 특정 날짜의 추억 조회
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json(
      { error: 'Date parameter is required' },
      { status: 400 }
    )
  }

  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('date', date)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json({
      memories: data || [],
      total: data?.length || 0,
    })
  } catch (error) {
    console.error('Error fetching memories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 }
    )
  }
}

// POST: 새로운 추억 업로드
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const date = formData.get('date') as string
    const sessionId = formData.get('sessionId') as string
    const content = formData.get('content') as string
    const image = formData.get('image') as File

    // 유효성 검사
    if (!date || !sessionId || !content || !image) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const contentValidation = validateContent(content)
    if (!contentValidation.valid) {
      return NextResponse.json(
        { error: contentValidation.error },
        { status: 400 }
      )
    }

    const imageValidation = validateImageFile(image)
    if (!imageValidation.valid) {
      return NextResponse.json(
        { error: imageValidation.error },
        { status: 400 }
      )
    }

    // 이미지 업로드
    const fileExt = image.name.split('.').pop()
    const fileName = `${sessionId}_${Date.now()}.${fileExt}`
    const filePath = `${date}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(MEMORIES_BUCKET)
      .upload(filePath, image)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: `Failed to upload image: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // 이미지 URL 가져오기
    const { data: urlData } = supabase.storage
      .from(MEMORIES_BUCKET)
      .getPublicUrl(filePath)

    // 데이터베이스에 저장
    const { data, error: dbError } = await supabase
      .from('memories')
      .insert({
        date,
        user_session_id: sessionId,
        image_url: urlData.publicUrl,
        content,
      })
      .select()
      .single()

    if (dbError) {
      // DB 저장 실패시 업로드한 이미지 삭제
      await supabase.storage.from(MEMORIES_BUCKET).remove([filePath])
      
      if (dbError.message.includes('Maximum 5 memories')) {
        return NextResponse.json(
          { error: 'This date already has 5 memories' },
          { status: 400 }
        )
      }
      
      if (dbError.message.includes('One user can upload only one memory')) {
        return NextResponse.json(
          { error: 'One user can upload only one memory :)' },
          { status: 400 }
        )
      }

      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save memory' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating memory:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

