import { defineEventHandler } from 'h3'
import { useNitroApp } from '#imports'

export default defineEventHandler(async () => {
  const { $petsFetch } = useNitroApp()

  return $petsFetch('/pet/{petId}', {
    path: {
      petId: 2
    }
  })
})
