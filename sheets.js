import { google } from "googleapis";
import fs from "fs";
import userData from "./assets/users.json" with { type: "json" }; 

const auth = new google.auth.GoogleAuth({
  keyFile: "./assets/credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "1wKRoIy-k90xnd5uUV51YI2fFtZyr9vhstUKQ8PH8W70";
const SHEET_NAME = "Data";

const cleanNumber = str => Number(String(str).replace(/,/g, "")) || 0;

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

// Sync Google Sheet values into users.json
export async function syncUsers() {
  try {
    //1. Get player data
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:J`, // adjust based on layout
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      console.log("No data found.");
      return;
    }

    // 2. Get thresholds (M21:P21)
    const threshRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!M21:P21`,
    });

    const thresholds = (threshRes.data.values?.[0] || []).map(v => cleanNumber(v)); 

    // Example: assume columns:
    // Col B = Name, Col E = Total Fans, Col F = Monthly Fans
    for (const row of rows) {
      const username = row[1]; // Column B
      const totalFans = cleanNumber(row[4]); // Column E
      const monthlyFans = cleanNumber(row[5]); // Column F
      const rankTotal = cleanNumber(row[7]); // Column H
      const rankMonthly = cleanNumber(row[8]); // Column I
      const growthDailyAvg = cleanNumber(row[6]); // Column G

      const user = userData.find(u => u.name.trim().toLowerCase() === username.trim().toLowerCase());
      if (user) {
        user.fans_total = totalFans.toString();
        user.fans_monthly = monthlyFans.toString();
        user.rank_total = rankTotal.toString();
        user.rank_monthly = rankMonthly.toString();
        user.daily_average = growthDailyAvg.toString();

        // Assign color based on thresholds
        let color = "red";
        if (thresholds.length > 0) {
          if (monthlyFans >= thresholds[0]) color = "purple";
          else if (monthlyFans >= thresholds[1]) color = "blue";
          else if (monthlyFans >= thresholds[2]) color = "green";
          else if (monthlyFans >= thresholds[3]) color = "yellow";
        }
        user.color = color;
      }
      if (!user) {
        console.log("No match for:", username);
        continue;
      }
    }

    // 3. Get median + total fans (M4 + N4)
    const statsRes = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges: [`${SHEET_NAME}!M4:N4`, `${SHEET_NAME}!M8`],
    });

    const stats1 = statsRes.data.valueRanges[0]?.values?.[0] || [];
    const stats2 = statsRes.data.valueRanges[1]?.values?.[0] || [];

    const medianFans = cleanNumber(stats1[0]);   // M4
    const totalFans = cleanNumber(stats1[1]);    // N4
    const dailyAvgMedian = cleanNumber(stats2[0]); // M8

    // Update the "Stats" pseudo-user
    const statsUser = userData.find(
      u => u.name.trim().toLowerCase() === "stats"
    );
    if (statsUser) {
      statsUser.fans_median = medianFans.toString();
      statsUser.fans_guild_total = totalFans.toString();
      statsUser.daily_average = dailyAvgMedian.toString();
    }

    // Save back to JSON
    fs.writeFileSync("./assets/users.json", JSON.stringify(userData, null, 4));
    
    return userData;

  } catch (err) {
    console.error("Error syncing users:", err);
    return [];
  }
}
