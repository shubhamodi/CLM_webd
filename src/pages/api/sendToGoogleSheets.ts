import { google } from 'googleapis';
import type { APIContext } from 'astro';

export const prerender = false; //ADDED LINE

export async function POST({ request }: APIContext) {
    const formData = await request.json();

    console.log(formData);
    // Google Sheets API setup
    const auth = await google.auth.getClient({
        credentials: {
            type: 'service_account',
            project_id: import.meta.env.GOOGLE_SHEETS_PROJECT_ID,
            private_key_id: import.meta.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
            private_key: import.meta.env.GOOGLE_SHEETS_PRIVATE_KEY, // Ensure newlines are correctly formatted
            client_email: 'google-sheets-api@beaming-glyph-427400-u7.iam.gserviceaccount.com',
            client_id: import.meta.env.GOOGLE_SHEETS_CLIENT_ID,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // The ID of the spreadsheet to update.
    const spreadsheetId = '1EVCYJVuE6J8lfu8C76Z5Ate-p36sc7DYS7Sn3p1k8Ng'; // Update this to your spreadsheet's ID

    // Specify the range and values to append
    const range = 'A1'; // Update this to the range where you want to append data
    const valueInputOption = 'USER_ENTERED';

    const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption,
        requestBody: {
            values: [
                [formData.name, formData.email, formData.phone, formData.useCase]
            ]
        }
    });

    // Send response back to client
    if (response.status === 200) {
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } else {
        return new Response(JSON.stringify({ success: false }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}