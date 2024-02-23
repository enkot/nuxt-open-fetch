import { send } from "h3"

export default defineEventHandler((event) => {
  return send(event, {
    hello: 'there'
  })
})