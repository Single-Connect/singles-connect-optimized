export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Single-Connect";

export const APP_LOGO =
  import.meta.env.VITE_APP_LOGO ||
  "https://img.icons8.com/fluency/96/hearts.png";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `https://www.single-connect.com/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

// Zodiac signs with dates
export const ZODIAC_SIGNS = [
  { name: "Widder", start: "03-21", end: "04-19", emoji: "♈" },
  { name: "Stier", start: "04-20", end: "05-20", emoji: "♉" },
  { name: "Zwillinge", start: "05-21", end: "06-20", emoji: "♊" },
  { name: "Krebs", start: "06-21", end: "07-22", emoji: "♋" },
  { name: "Löwe", start: "07-23", end: "08-22", emoji: "♌" },
  { name: "Jungfrau", start: "08-23", end: "09-22", emoji: "♍" },
  { name: "Waage", start: "09-23", end: "10-22", emoji: "♎" },
  { name: "Skorpion", start: "10-23", end: "11-21", emoji: "♏" },
  { name: "Schütze", start: "11-22", end: "12-21", emoji: "♐" },
  { name: "Steinbock", start: "12-22", end: "01-19", emoji: "♑" },
  { name: "Wassermann", start: "01-20", end: "02-18", emoji: "♒" },
  { name: "Fische", start: "02-19", end: "03-20", emoji: "♓" },
];

export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function getZodiacSign(birthDate: Date): string {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const dateStr = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
  for (const sign of ZODIAC_SIGNS) {
    const [startMonth, startDay] = sign.start.split('-').map(Number);
    const [endMonth, endDay] = sign.end.split('-').map(Number);
    
    // Handle year wrap (Capricorn)
    if (startMonth > endMonth) {
      if (month === startMonth && day >= startDay || month === endMonth && day <= endDay) {
        return sign.name;
      }
    } else {
      if ((month === startMonth && day >= startDay) || 
          (month === endMonth && day <= endDay) ||
          (month > startMonth && month < endMonth)) {
        return sign.name;
      }
    }
  }
  
  return "Unbekannt";
}