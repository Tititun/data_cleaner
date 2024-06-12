export const HOST = 'http://127.0.0.1:8000'

export const headers = { "Content-Type": "application/json",
                 "Access-Control-Allow-Headers": "*",
                 "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
                 "Access-Control-Allow-Origin": "*"
                }

export const empty_filters = {
    source: '', category: '', name: '', translation: '', level_1: '', level_2: '', level_3: '', lang: '', show_classified: true
  }

export const langs = ["ar", "az", "cs", "da", "de", "el", "en", "es", "et", "fa", "fi", "fr", "he", "hu", "id", "it", "ja", "ko", "nl", "no", "pl", "pt", "ro", "ru", "sk", "sr", "sv", "th", "tr", "uk", "zh", "nen"]
