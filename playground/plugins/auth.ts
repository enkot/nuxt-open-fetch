import { defineNuxtPlugin, useAuth } from "#imports"

export default defineNuxtPlugin(async () => {
  const auth = useAuth()
  await auth.init()
  
  return {
    provide: { auth },
  }
})