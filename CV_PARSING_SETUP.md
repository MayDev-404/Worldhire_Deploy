# CV Parsing Setup with Hugging Face Gemma3 and Tesseract OCR

This application uses:
- **Tesseract OCR** for extracting text from PDF files (including scanned/image-based PDFs)
- **Hugging Face's Inference API with Gemma models** to automatically parse CV/resume text and extract structured data

## Setup Instructions

### 1. Get Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up or log in to your account
3. Navigate to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. Create a new token with "Read" permissions
5. Copy the token

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Hugging Face API Key (required for CV parsing)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Optional: Specify which Gemma model to use
# Default: "google/gemma-2b-it"
# Other options:
# - "google/gemma-7b-it" (more accurate but slower)
# - "google/gemma-1.1-2b-it" (faster but less accurate)
HUGGINGFACE_MODEL=google/gemma-2b-it
```

### 3. Available Gemma Models

The following Gemma models are available on Hugging Face:

- `google/gemma-2b-it` (default) - Fast and efficient, good for most use cases
- `google/gemma-7b-it` - More accurate but slower and uses more tokens
- `google/gemma-1.1-2b-it` - Latest 2B model, optimized performance

### 4. How It Works

1. User uploads a CV file (PDF, DOC, or DOCX)
2. **For PDF files:**
   - PDF pages are converted to images using PDF.js
   - Tesseract OCR extracts text from each page image
   - Text from all pages is combined
3. **For DOC/DOCX files:**
   - Text is extracted directly using mammoth library
4. The extracted text is sent to Hugging Face Inference API with a carefully crafted prompt
5. Gemma model extracts structured data including:
   - Personal information (name, email, phone, location)
   - Skills and experience
   - Work history (structured with company, role, dates)
   - Education (structured with degree, institute, years)
   - LinkedIn profile and other links
5. The extracted data automatically fills the form fields

### 5. Supported File Formats

- **PDF (`.pdf`)** - Uses Tesseract OCR for text extraction (works with both text-based and scanned PDFs)
- **Microsoft Word (`.doc`, `.docx`)** - Direct text extraction
- **Plain text (`.txt`)** - Direct text reading

### 5.1. PDF Processing Details

- PDF pages are rendered to images at 2x scale for better OCR accuracy
- Each page is processed through Tesseract OCR
- Works with both text-based PDFs and scanned/image-based PDFs
- OCR processing may take longer for multi-page documents

### 6. Error Handling

- If the Hugging Face API key is not set, CV parsing will be skipped silently
- If parsing fails, the form will still work - users can fill it manually
- Errors are logged to the console for debugging

### 7. Cost Considerations

Hugging Face Inference API has usage limits:
- Free tier: Limited requests per month
- Paid tier: Pay-as-you-go pricing

Check [Hugging Face Pricing](https://huggingface.co/pricing) for current rates.

### 8. Troubleshooting

**CV parsing not working:**
- Check that `HUGGINGFACE_API_KEY` is set in `.env.local`
- Verify the API key is valid and has proper permissions
- Check browser console and server logs for errors

**Incorrect data extraction:**
- Try a different model (e.g., `gemma-7b-it` for better accuracy)
- Ensure the CV is well-formatted and readable
- Some CVs may require manual correction

**Slow parsing:**
- Smaller models (2b) are faster than larger ones (7b)
- Consider using `gemma-2b-it` for faster responses

## Notes

- The CV text is truncated to 3000 characters to stay within token limits
- The model may not extract all fields perfectly - manual review is recommended
- Work experiences and educations are extracted as structured arrays for better data quality

