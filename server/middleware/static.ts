import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
    event.res.setHeader('Access-Control-Allow-Origin', '*')
    event.res.setHeader('Cache-Control', 'public, max-age=3600')
})