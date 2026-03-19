import fs from "fs";
import Typesense from "typesense";

/* -------------------------------
   TYPESENSE CLIENT
-------------------------------- */
const typesense = new Typesense.Client({
  nodes: [
    {
      host: "y74tz6wk0lij1rpbp-1.a1.typesense.net",
      port: 443,
      protocol: "https"
    }
  ],
  apiKey: "Mle4gIyj0wxzPb0OGoIo0zhkMY7QsKG5",
  connectionTimeoutSeconds: 5
});

/* -------------------------------
   LOAD JSON FILE
-------------------------------- */
const raw = fs.readFileSync("./data/candidates.json", "utf8");
const candidates = JSON.parse(raw);

/* -------------------------------
   NORMALIZE → TYPESENSE DOC
-------------------------------- */
function toTypesenseDoc(c) {
  return {
    id: c.id,
    name: c.name ?? "",

    skills: c.skills ?? "",
    preferred_role: c.preferred_role ?? "",
    work_experience_text: c.work_experience_text ?? "",
    education_text: c.education_text ?? "",

    current_location: c.current_location ?? "",
    preferred_location: c.preferred_location ?? "",
    seniority_level: c.seniority_level ?? "",

    work_mode: c.work_mode ?? "",
    employment_type: c.employment_type ?? "",
    notice_period: c.notice_period ?? "",
    actively_seeking_toggle: c.actively_seeking_toggle ?? "",
    application_status: c.application_status ?? "",

    profile_completion_percentage:
      Number(c.profile_completion_percentage) || 0,

    /* FIX: timestamp → int64 */
    created_at: new Date(c.created_at).getTime(),

    /* FIX: "2 years" → 2 */
    experience_years: (() => {
      if (!c.experience) return 0;
      const match = String(c.experience).match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    })()
  };
}

/* -------------------------------
   IMPORT INTO TYPESENSE
-------------------------------- */
async function importDocs() {
  const docs = candidates.map(toTypesenseDoc);

  const result = await typesense
    .collections("candidates")
    .documents()
    .import(docs, { action: "upsert" });

  console.log("Import result:");
  console.log(result);
}

importDocs().catch(console.error);
