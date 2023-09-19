import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  return {
    id: 'test',
    hello: 'world'
  }
})