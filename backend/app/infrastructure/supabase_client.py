import os
from supabase import create_client

_client = None

def get_supabase_client():
    global _client
    if _client is None:
        url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
        key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        if not url or not key:
            raise RuntimeError('Supabase environment variables not set')
        _client = create_client(url, key)
    return _client
