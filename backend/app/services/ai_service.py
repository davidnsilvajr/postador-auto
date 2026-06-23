import httpx
import json
from typing import Optional
from app.config import get_settings
from app.database import supabase


# ---------- helpers ----------

def get_brand_context(brand_id: str) -> dict:
    brand_r = supabase.table("brands").select("*").eq("id", brand_id).execute()
    guideline_r = supabase.table("brand_guidelines").select("*").eq("brand_id", brand_id).execute()
    return {
        "brand": brand_r.data[0] if brand_r.data else {},
        "guideline": guideline_r.data[0] if guideline_r.data else {},
    }


def _openrouter_chat(system: str, user_msg: str, model: Optional[str] = None) -> str:
    """Send a chat completion via OpenRouter (OpenAI-compatible API)"""
    settings = get_settings()

    resp = httpx.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Postador Auto",
        },
        json={
            "model": model or settings.OPENROUTER_TEXT_MODEL,
            "temperature": 0.8,
            "max_tokens": 4096,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user_msg},
            ],
        },
        timeout=60.0,
    )
    data = resp.json()

    if "error" in data:
        raise ValueError(f"OpenRouter error: {data['error']}")

    return data["choices"][0]["message"]["content"]


def _extract_json(text: str) -> dict:
    """Extract JSON from Markdown code blocks"""
    if "```json" in text:
        text = text.split("```json")[1].split("```")[0].strip()
    elif "```" in text:
        text = text.split("```")[1].split("```")[0].strip()
    return json.loads(text)


# ---------- public API ----------

def generate_post_content(
    topic: str,
    brand_id: str,
    platforms: list[str],
    tone: Optional[str] = None,
    language: str = "pt-BR",
    campaign: Optional[str] = None,
) -> dict:
    ctx = get_brand_context(brand_id)
    brand = ctx["brand"]
    guideline = ctx["guideline"]

    system_prompt = f"""Voce e um social media marketing profissional especializado em criar conteudo de alta performance para redes sociais brasileiras.

## Sobre a marca / persona do cliente:
- Nome: {brand.get('name', 'N/A')}
- Industria / segmento: {brand.get('industry', 'N/A')}
- O que faz (descricao): {brand.get('description', 'N/A')}
- Publico-alvo: {brand.get('target_audience') or 'N/A'}
- Dados da empresa: {brand.get('company_info') or 'N/A'}
- Site: {brand.get('website') or 'N/A'}
- Tom de voz: {tone or brand.get('tone_of_voice', 'N/A')}
- Tagline: {guideline.get('tagline', 'N/A')}
- Palavras-chave: {', '.join(guideline.get('keywords', []))}
- Voz da marca: {guideline.get('brand_voice_description', 'N/A')}
- NAO usar: {', '.join(guideline.get('do_not_say', [])) if guideline.get('do_not_say') else 'Nada especifico'}
- SEMPRE incluir: {', '.join(guideline.get('must_include', [])) if guideline.get('must_include') else 'Nada especifico'}
- Campanha: {campaign or 'Nenhuma campanha especifica'}

Responda EXCLUSIVAMENTE em JSON valido:
{{
  "captions": {{
    "instagram": "caption aqui",
    "facebook": "caption aqui",
    "twitter": "caption aqui (max 280 chars)",
    "linkedin": "caption aqui (tom mais profissional)"
  }},
  "hashtags": ["#hashtag1", "#hashtag2", "..."],
  "image_prompt": "descricao detalhada da imagem para gerar",
  "variations": ["variacao 1", "variacao 2", "variacao 3"],
  "best_posting_times": ["09:00", "12:00", "18:00", "20:00"],
  "content_pillars": ["educacional", "inspiracional", "promocional"]
}}"""

    user_msg = f"Crie conteudo para:\n\nTema: {topic}\nPlataformas: {', '.join(platforms)}"
    raw = _openrouter_chat(system_prompt, user_msg)
    return _extract_json(raw)


def _upload_to_supabase(image_bytes: bytes, brand_id: Optional[str]) -> Optional[str]:
    """Upload image bytes to Supabase Storage and return the public URL."""
    try:
        import uuid
        folder = brand_id or "misc"
        file_path = f"generated/{folder}/{uuid.uuid4().hex}.png"
        supabase.storage.from_("brand-assets").upload(
            file_path, image_bytes, {"content-type": "image/png"}
        )
        return supabase.storage.from_("brand-assets").get_public_url(file_path)
    except Exception:
        return None


def _generate_image_gemini(prompt: str, settings) -> tuple[Optional[bytes], Optional[str]]:
    """Generate image using Gemini via OpenRouter chat completions.

    Gemini image models use the chat completions endpoint with
    modalities=["text", "image"]. The response contains images as
    base64 data URLs in message.images[].image_url.url.
    """
    import base64 as b64mod

    resp = httpx.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Postador Auto",
        },
        json={
            "model": settings.OPENROUTER_IMAGE_MODEL,
            "modalities": ["text", "image"],
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                    ],
                }
            ],
        },
        timeout=120.0,
    )
    data = resp.json()

    if "error" in data:
        raise ValueError(f"Gemini image error: {data['error']}")

    msg = data["choices"][0]["message"]

    # Images come in message.images[] as data URLs
    images = msg.get("images") or []
    for img in images:
        url = img.get("image_url", {}).get("url", "")
        if url.startswith("data:image/"):
            # Extract base64 from data URL: "data:image/png;base64,AAAA..."
            b64_data = url.split(",", 1)[1]
            return b64mod.b64decode(b64_data), None

    # Some responses embed images inline in content parts
    content = msg.get("content")
    if isinstance(content, list):
        for part in content:
            if isinstance(part, dict) and part.get("type") == "image_url":
                url = part.get("image_url", {}).get("url", "")
                if url.startswith("data:image/"):
                    b64_data = url.split(",", 1)[1]
                    return b64mod.b64decode(b64_data), None
                if url.startswith("http"):
                    dl = httpx.get(url, timeout=120.0)
                    if dl.status_code == 200:
                        return dl.content, url

    return None, None


def _generate_image_openai(prompt: str, api_key: str) -> tuple[Optional[bytes], Optional[str]]:
    """Generate image using OpenAI SDK directly (DALL-E 3). Returns (bytes, url)."""
    from openai import OpenAI
    import base64 as b64mod

    client = OpenAI(api_key=api_key)
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        n=1,
        size="1024x1024",
        response_format="b64_json",
    )
    b64 = response.data[0].b64_json
    if b64:
        return b64mod.b64decode(b64), None
    return None, response.data[0].url


def generate_image(image_prompt: str, brand_id: Optional[str] = None) -> str:
    """Generate an image and return a STABLE public URL.

    Primary: Gemini via OpenRouter (chat completions with modalities).
    Fallback: OpenAI DALL-E 3 (if OPENAI_API_KEY is set).

    The Instagram Graph API needs a durable public URL, so the image bytes
    are re-hosted in the Supabase `brand-assets` bucket.
    """
    settings = get_settings()

    if brand_id:
        ctx = get_brand_context(brand_id)
        guideline = ctx["guideline"]
        if guideline.get("primary_color"):
            image_prompt += f"\nUse the primary color #{guideline['primary_color']} in the image."

    image_bytes: Optional[bytes] = None
    fallback_url: Optional[str] = None
    errors: list[str] = []

    # 1) Primary: Gemini via OpenRouter
    try:
        image_bytes, fallback_url = _generate_image_gemini(image_prompt, settings)
    except Exception as exc:
        errors.append(f"Gemini: {exc}")

    # 2) Fallback: OpenAI DALL-E 3
    if not image_bytes and not fallback_url and settings.OPENAI_API_KEY:
        try:
            image_bytes, fallback_url = _generate_image_openai(image_prompt, settings.OPENAI_API_KEY)
        except Exception as exc:
            errors.append(f"DALL-E: {exc}")

    # Re-host in Supabase Storage for a stable, public URL.
    if image_bytes:
        stable_url = _upload_to_supabase(image_bytes, brand_id)
        if stable_url:
            return stable_url

    if fallback_url:
        return fallback_url

    error_detail = "; ".join(errors) if errors else "No usable image returned"
    raise ValueError(f"Image generation failed — {error_detail}")


def suggest_content_pillars(brand_id: str) -> list[dict]:
    ctx = get_brand_context(brand_id)
    brand = ctx["brand"]

    system_prompt = f"""Voce e um estrategista de marketing digital.
Based na marca abaixo, sugira 5-8 content pillars.

Marca: {brand.get('name', 'N/A')}
Industria: {brand.get('industry', 'N/A')}
Descricao: {brand.get('description', 'N/A')}

JSON: {{"pillars": [{{"name": "nome", "description": "descricao", "examples": []}}]}}"""

    raw = _openrouter_chat(system_prompt, "Sugira content pillars para esta marca.")
    return _extract_json(raw).get("pillars", [])


def generate_monthly_calendar(brand_id: str, month: int, year: int) -> list[dict]:
    ctx = get_brand_context(brand_id)

    system_prompt = f"""Crie um calendario de conteudo mensal.
Marca: {ctx['brand'].get('name', 'N/A')}
Industria: {ctx['brand'].get('industry', 'N/A')}
Mes: {month}/{year}

JSON: {{"calendar": [{{"date": "YYYY-MM-DD", "topic": "tema", "content_pillar": "pilar", "platform": ["instagram"]}}]}}"""

    raw = _openrouter_chat(system_prompt, f"Crie o calendario para {month}/{year}.")
    return _extract_json(raw).get("calendar", [])


def rewrite_for_platform(caption: str, platform: str, brand_context: dict) -> str:
    specs = {
        "instagram": "Ate 2200 chars, visual, emojis moderados, hashtags no final. Tom casual.",
        "facebook": "Ate 5000 chars, conversacional mas informativo.",
        "twitter": "MAXIMO 280 caracteres. Direto e impactante.",
        "linkedin": "Profissional e analitico. Dados e insights. Sem emojis.",
        "tiktok": "Curto e divertido. Ate 100 chars de texto na tela.",
        "youtube": "Descritivo e SEO-otimizado. Inclua timestamps e CTAs.",
    }

    raw = _openrouter_chat(
        f"Voce e um copywriter especialista em {platform}. {specs.get(platform, '')}",
        f"Reescreva este caption para {platform}:\n\n{caption}",
    )
    return raw
