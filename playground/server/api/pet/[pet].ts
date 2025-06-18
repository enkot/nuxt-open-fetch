import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const pet = event.context.params?.pet
  return { message: `Pet: ${pet}` }
})
