import { google } from "googleapis";
import userData from "./assets/users.json" with { type: "json" }; 

const auth = new google.auth.GoogleAuth({
  keyFile: "./assets/credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "1wKRoIy-k90xnd5uUV51YI2fFtZyr9vhstUKQ8PH8W70";
const SHEET_NAME = "Data";

// Update pending data for a user
export async function logPending(discordId, value) {
  try {

    // Find the username from your JSON
    const user = userData.find(u => u.id === discordId);
    if (!user) return "User ID not found in JSON.";

    const username = user.name;

    // Read the sheet to find the user row
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:J`, // adjust based on your sheet
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) return "No data found.";

    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][1] === username) { // Assuming column A = Name
        rowIndex = i + 2; // +2 because sheet starts at A2
        break;
      }
    }

    if (rowIndex === -1) return "User not found.";

    // Update Pending Data column (e.g. J)
    const range = `${SHEET_NAME}!J${rowIndex}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[value]],
      },
    });

    return `Updated ${username}'s fancount to ${Number(value).toLocaleString()} in Pending Data. Thank you for your hard work.`;

  } catch (err) {
    console.error(err);
    return "Error updating sheet.";
  }
}
