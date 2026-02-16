import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not available' }, { status: 404 })
    }

    const apiKey = process.env.BILLPLZ_API_KEY
    const isSandbox = process.env.BILLPLZ_SANDBOX === 'true'

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'BILLPLZ_API_KEY not configured in .env.local' },
        { status: 500 }
      )
    }

    const baseURL = isSandbox
      ? 'https://www.billplz-sandbox.com/api/v4'
      : 'https://www.billplz.com/api/v4'

    const response = await axios.get(`${baseURL}/webhook_rank`, {
      auth: { username: apiKey, password: '' },
      headers: { 'Accept': 'application/json' },
    })

    return NextResponse.json({
      success: true,
      message: 'Authentication successful!',
      environment: isSandbox ? 'Sandbox' : 'Production',
      apiEndpoint: baseURL,
      response: response.data,
      statusCode: response.status,
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      if (status === 401) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized - Invalid API Key', statusCode: 401 },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { success: false, error: `Billplz API Error: ${status}`, statusCode: status },
        { status: status || 500 }
      )
    }
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
