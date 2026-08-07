
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();


const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});


export const sheets = google.sheets({
    version: "v4",
    auth,
});