import characters from './assets/character.json' with { type: "json" };
import fetch from "node-fetch";

// Extract the bracketed title, normalize it
function extractTitle(ocrText) {
  const match = ocrText.match(/\[(.*?)\]/);
  if (!match) return null;
  return match[1]
    .toLowerCase()
    .replace(/[\-:|]/g, " ")  // turn dashes/colons/pipes into spaces
    .replace(/\s+/g, " ")     // collapse multiple spaces
    .trim();
}

function resolveUma(ocrText) {
  const title = extractTitle(ocrText);

  if (title) {
    for (const uma of characters) {
      if (uma.aliases?.some(alias => alias.toLowerCase() === title)) {
        return {
          title,
          name: uma.character_name,
          type: uma.type,
          id: uma.id,
          url: uma.url,
          thumbnail: uma.thumbnail
        };
      }
    }
  }

  // fallback to base name detection if no alias matched
  for (const uma of characters) {
    if (uma.character_name &&
        ocrText.toLowerCase().includes(uma.character_name.toLowerCase())) {
      return {
        title: null,
        name: uma.character_name,
        type: uma.type,
        id: uma.id,
        url: uma.url,
        thumbnail: uma.thumbnail
      };
    }
  }

  return { title: null, name: "Unknown", id: null };
}

export function parseUmaProfile(ocrText) {
  const umaInfo = resolveUma(ocrText);

  return {
    name: umaInfo.name,
    title: umaInfo.title,
    type: umaInfo.type,
    stats: { Speed: "?", Stamina: "?", Power: "?", Guts: "?", Wit: "?" },
    track: { Turf: "?", Dirt: "?" },
    distance: { Sprint: "?", Mile: "?", Medium: "?", Long: "?" },
    style: { Front: "?", Pace: "?", Late: "?", End: "?" },
    skills: [],
    thumbnail: umaInfo.thumbnail
  };
}

export async function parseWithOcrSpace(imageUrl) {
  const apiKey = process.env.OCR_SPACE_KEY; // store your key in .env
  const formData = new URLSearchParams();
  formData.append("url", imageUrl);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: {
      apikey: apiKey,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData
  });

  const result = await response.json();

  if (result.IsErroredOnProcessing) {
    throw new Error(result.ErrorMessage || "OCR.space failed");
  }

  // The parsed text is usually here:
  return result.ParsedResults?.[0]?.ParsedText?.trim() || "";
}

export function buildUmaParsedEmbed(parsed) {
  return {
    title: `${parsed.name} (${parsed.type || "Unknown"})`,
    description: `**Stats**\nSpeed: ${parsed.stats.Speed} | Stamina: ${parsed.stats.Stamina} | Power: ${parsed.stats.Power} | Guts: ${parsed.stats.Guts} | Wit: ${parsed.stats.Wit}`,
    fields: [
      {
        name: "Track",
        value: `Turf: ${parsed.track.Turf} | Dirt: ${parsed.track.Dirt}`,
        inline: true
      },
      {
        name: "Distance",
        value: `Sprint: ${parsed.distance.Sprint} | Mile: ${parsed.distance.Mile} | Medium: ${parsed.distance.Medium} | Long: ${parsed.distance.Long}`,
        inline: true
      },
      {
        name: "Style",
        value: `Front: ${parsed.style.Front} | Pace: ${parsed.style.Pace} | Late: ${parsed.style.Late} | End: ${parsed.style.End}`,
        inline: true
      },
      {
        name: "Skills",
        value: parsed.skills?.length ? parsed.skills.join("\n") : "None"
      }
    ],
    url: parsed.url || null,
    thumbnail: parsed.thumbnail ? { url: parsed.thumbnail } : undefined,
    color: 0x00AE86
  };
}