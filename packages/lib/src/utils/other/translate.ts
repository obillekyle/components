const langCodes: Record<string, string> = {
  ph: 'tl'
}

const store: Map<string, string> = new Map()

export async function getTranslatedText(text: string, lang: string = 'en') {
  lang = langCodes[lang] || lang
  const key = `${lang}:${text}`

  if (store.has(key)) return store.get(key)!

  try {
    const req = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${text}`
    )

    if (!req.ok) throw new Error('Failed to get translation')

    const json = await req.json()
    const data = json[0][0][0] as string

    store.set(key, data)
    return data
  } catch {
    console.error(
      `Failed to get translation for "${text}" in "${lang}" language`
    )
  }

  return text
}
