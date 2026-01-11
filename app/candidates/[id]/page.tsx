import { notFound } from "next/navigation"
import { getSupabaseAdminClient } from "@/lib/supabase/server"
import type { Candidate } from "@/types/candidate"

type Props = {
  // Next may pass `params` as a plain object or a Promise that resolves to the object.
  params: { id: string } | Promise<{ id: string }>
}

export default async function CandidatePage({ params }: Props) {
  // `params` can be a Promise in some Next.js configurations; await it to unwrap.
  const { id } = await params
  // Use the admin/service-role client for reads so this page can show candidate
  // details regardless of the requesting session (bypasses RLS). This must run
  // only on the server—do NOT expose the service role key to client code.
  const supabase = getSupabaseAdminClient()

  // Use maybeSingle() to avoid PostgREST error when zero rows are found.
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error || !data) {
    // Not found or query error — show 404
    notFound()
  }

  const candidate = data as Candidate

  return (
    <div style={{ padding: 24 }}>
      <h1>Candidate details</h1>
      <dl>
        <dt>Name</dt>
        <dd>{candidate.name}</dd>

        <dt>Email</dt>
        <dd>{candidate.email}</dd>

        <dt>Mobile</dt>
        <dd>{candidate.mobile_number}</dd>

        <dt>Current location</dt>
        <dd>{candidate.current_location}</dd>

        <dt>Skills</dt>
        <dd>{candidate.skills || "—"}</dd>

        <dt>Experience</dt>
        <dd>{candidate.experience || "—"}</dd>

        {candidate.cv_url && (
          <>
            <dt>CV</dt>
            <dd>
              <a href={candidate.cv_url} target="_blank" rel="noreferrer">
                View CV
              </a>
            </dd>
          </>
        )}

        {candidate.photograph_url && (
          <>
            <dt>Photo</dt>
            <dd>
              <img src={candidate.photograph_url} alt={`${candidate.name} photo`} style={{ maxWidth: 200 }} />
            </dd>
          </>
        )}
      </dl>

      <div style={{ marginTop: 16 }}>
  <a href={`/candidates/${id}/edit`}>Edit candidate</a>
      </div>
    </div>
  )
}
