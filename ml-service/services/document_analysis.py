"""OCR provider integration boundary. No government documents are fabricated here."""
def analyze_document(text: str) -> dict:
    return {'text_length': len(text), 'provider': 'not configured', 'advisory_only': True}
