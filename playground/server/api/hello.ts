import { defineEventHandler } from 'h3'
import { useNitroApp } from '#imports'

export default defineEventHandler(async () => {
  const { $pets } = useNitroApp()

  return $pets('/pet/{petId}', {
    path: {
      petId: 2
    }
  })
})
