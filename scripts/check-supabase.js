#!/usr/bin/env node
// Minimal check script: uses service role key (or anon key) from env to query the candidates table
// Prints a compact JSON result to stdout.

const { createClient } = require('@supabase/supabase-js')

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error(JSON.stringify({ ok: false, error: 'Missing SUPABASE env vars' }))
    process.exit(2)
  }

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

  const id = process.argv[2] || '6a1e8f8e-07ba-472a-9f1d-7698443f0cc5'

  try {
    const { data, error } = await supabase.from('candidates').select('id,name,email').eq('id', id).maybeSingle()
    if (error) {
      console.error(JSON.stringify({ ok: false, error: String(error) }))
      process.exit(3)
    }

    if (!data) {
      console.log(JSON.stringify({ ok: true, found: false }))
      process.exit(0)
    }

    console.log(JSON.stringify({ ok: true, found: true, candidate: data }))
    process.exit(0)
  } catch (err) {
    console.error(JSON.stringify({ ok: false, error: String(err) }))
    process.exit(4)
  }
}

main()
