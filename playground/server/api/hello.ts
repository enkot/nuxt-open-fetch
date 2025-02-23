import { useNitroApp } from '#imports'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const { $pets } = useNitroApp()

  return $pets('/pet/{petId}', {
    path: {
      petId: 2,
    },
  })
})
