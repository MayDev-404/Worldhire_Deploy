import time
from typing import Optional, Dict, Any
from fastapi import UploadFile
from .supabase_client import get_supabase_client
import logging

logger = logging.getLogger("backend")

class StorageService:
    def __init__(self):
        self.supabase = get_supabase_client()

    async def upload_cv(self, file: UploadFile, candidate_id: Optional[str] = None) -> Optional[str]:
        """Uploads a CV to Supabase Storage and records metadata in cv_uploads table."""
        contents = await file.read()
        
        # Reset file cursor so it can be read again if needed
        await file.seek(0)
        
        # Create a unique filename
        filename = f"{candidate_id if candidate_id else 'anon'}_{int(time.time())}_{file.filename}"
        
        cv_url = None
        try:
            res = self.supabase.storage.from_('candidate-cvs').upload(filename, contents)
            if res:
                public = self.supabase.storage.from_('candidate-cvs').get_public_url(filename)
                if isinstance(public, dict):
                    cv_url = public.get('publicURL') or public.get('public_url')
                elif hasattr(public, 'get'):
                    cv_url = public.get('publicURL') or public.get('public_url')
                else:
                    cv_url = str(public) if public else None
        except Exception as e:
            logger.error(f"CV upload error: {e}")
            raise RuntimeError(f"Failed to upload CV to storage: {e}")

        if cv_url:
            # Save file metadata to cv_uploads table
            metadata = {
                "file_url": cv_url,
            }
            if candidate_id:
                metadata["candidate_id"] = candidate_id
                
            try:
                self.supabase.table('cv_uploads').insert(metadata).execute()
            except Exception as e:
                # Table may not exist yet if migration hasn't been run — this is non-critical
                logger.warning(f"Could not save CV metadata (cv_uploads table may not exist): {e}")
                
        return cv_url

    async def upload_photo(self, file: UploadFile) -> Optional[str]:
        """Uploads a photo to Supabase Storage."""
        contents = await file.read()
        await file.seek(0)
        
        filename = f"{int(time.time())}_{file.filename}"
        photo_url = None
        
        try:
            res = self.supabase.storage.from_('candidate-photos').upload(filename, contents)
            if res:
                public = self.supabase.storage.from_('candidate-photos').get_public_url(filename)
                if isinstance(public, dict):
                    photo_url = public.get('publicURL') or public.get('public_url')
                elif hasattr(public, 'get'):
                    photo_url = public.get('publicURL') or public.get('public_url')
                else:
                    photo_url = str(public) if public else None
        except Exception as e:
            logger.error(f"Photo upload error: {e}")
            
        return photo_url
