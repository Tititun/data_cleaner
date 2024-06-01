export const HOST = 'http://127.0.0.1:8000'

export const headers = { "Content-Type": "application/json",
                 "Access-Control-Allow-Headers": "*",
                 "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
                 "Access-Control-Allow-Origin": "*"
                }

export const empty_filters = {
    source: '', category: '', name: '', translation: '', level_1: '', level_2: '', level_3: '', show_classified: true
  }