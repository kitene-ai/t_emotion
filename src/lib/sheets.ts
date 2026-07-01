/**
 * Google Sheets API Integration Helper
 */

export function extractSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  // Match standard spreadsheet url format
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

export interface SheetAppendResponse {
  spreadsheetId: string;
  updatedRange: string;
}

/**
 * Creates a brand new Google Sheet with proper headers
 */
export async function createNewSpreadsheet(
  accessToken: string,
  title: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: title,
      },
      sheets: [
        {
          properties: {
            title: '감정기록',
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || '구글 시트 생성에 실패했습니다.');
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write headers immediately
  await setupSheetHeaders(accessToken, spreadsheetId);

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Writes the header row to the newly created sheet
 */
export async function setupSheetHeaders(accessToken: string, spreadsheetId: string): Promise<void> {
  const range = "'감정기록'!A1:F1";
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [
          ['날짜', '기록 시간', '교사 이름', '이모티콘', '감정 상태', '상황 설명'],
        ],
      }),
    }
  );

  if (!response.ok) {
    // If "감정기록" sheet does not exist or fails, try to write to first sheet without name
    const fallbackRange = "A1:F1";
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${fallbackRange}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [
            ['날짜', '기록 시간', '교사 이름', '이모티콘', '감정 상태', '상황 설명'],
          ],
        }),
      }
    );
  }
}

/**
 * Appends a log entry to the Google Sheet
 */
export async function appendEmotionRecord(
  accessToken: string,
  spreadsheetId: string,
  record: {
    date: string;
    time: string;
    teacherName: string;
    emoji: string;
    emotionTitle: string;
    emotionDescription: string;
  }
): Promise<SheetAppendResponse> {
  const range = "'감정기록'!A:F";
  const body = {
    values: [
      [
        record.date,
        record.time,
        record.teacherName,
        record.emoji,
        record.emotionTitle,
        record.emotionDescription,
      ],
    ],
  };

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    // Fallback if "감정기록" tab doesn't exist (e.g., user linked a random existing sheet)
    const fallbackRange = "A:F";
    const fallbackResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${fallbackRange}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!fallbackResponse.ok) {
      const errData = await fallbackResponse.json().catch(() => ({}));
      throw new Error(errData.error?.message || '구글 시트에 데이터를 기록하지 못했습니다. 시트 편집 권한이 있는지 확인하세요.');
    }

    const data = await fallbackResponse.json();
    return {
      spreadsheetId,
      updatedRange: data.updates?.updatedRange || 'A:F',
    };
  }

  const data = await response.json();
  return {
    spreadsheetId,
    updatedRange: data.updates?.updatedRange || '감정기록!A:F',
  };
}

/**
 * Checks if spreadsheet is accessible and has proper structure
 */
export async function validateSpreadsheetAccess(accessToken: string, spreadsheetId: string): Promise<boolean> {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=spreadsheetId`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.ok;
  } catch (err) {
    return false;
  }
}
