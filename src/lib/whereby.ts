interface WherebyMeetingResponse {
  meetingId: string
  startDate: string
  endDate: string
  roomUrl: string
  hostRoomUrl: string
}

export async function createWherebyMeeting(
  startTime: string,
  endTime: string
): Promise<string> {
  const apiKey = process.env.WHEREBY_API_KEY

  if (!apiKey) {
    console.error('WHEREBY_API_KEY not configured')
    throw new Error('Whereby API key not configured')
  }

  try {
    const response = await fetch('https://api.whereby.dev/v1/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: startTime,
        endDate: endTime,
        fields: ['hostRoomUrl'],
        roomNamePattern: 'human-short',
        roomMode: 'normal',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Whereby API error:', response.status, errorText)
      throw new Error(`Whereby API error: ${response.status}`)
    }

    const data: WherebyMeetingResponse = await response.json()
    console.log('Whereby meeting created:', data.meetingId)

    return data.roomUrl
  } catch (error) {
    console.error('Failed to create Whereby meeting:', error)
    throw error
  }
}

export async function deleteWherebyMeeting(meetingId: string): Promise<void> {
  const apiKey = process.env.WHEREBY_API_KEY

  if (!apiKey) {
    console.warn('WHEREBY_API_KEY not configured, skipping meeting deletion')
    return
  }

  try {
    const response = await fetch(`https://api.whereby.dev/v1/meetings/${meetingId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      console.error('Failed to delete Whereby meeting:', response.status)
    } else {
      console.log('Whereby meeting deleted:', meetingId)
    }
  } catch (error) {
    console.error('Error deleting Whereby meeting:', error)
  }
}
