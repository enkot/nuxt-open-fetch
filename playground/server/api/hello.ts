import { useNitroApp } from '#imports'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const { $api } = useNitroApp()

  return $api('/pet/{petId}', {
    path: {
      petId: 2,
    },
  })
})
