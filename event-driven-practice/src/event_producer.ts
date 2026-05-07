import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {SQSClient, SendMessageCommand} from '@aws-sdk/client-sqs'

const app = new Hono()

app.post('/', async (c) => {
  const sqsClient = new SQSClient({region: 'us-east-2'})
  const body = await c.req.json(); 
 
  const sqsMessage = new SendMessageCommand({QueueUrl: 'https://sqs.us-east-2.amazonaws.com/251071362032/MyQueue', MessageBody: JSON.stringify(body)})
  const response = await sqsClient.send(sqsMessage)
  console.log(response)
  return c.text(JSON.stringify(response))
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
