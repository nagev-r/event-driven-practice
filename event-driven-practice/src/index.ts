import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {SQSClient, SendMessageCommand} from '@aws-sdk/client-sqs'

const app = new Hono()

// app.get('/', (c) => {
//   return c.text('Hello Homo!')
// })
app.post('/', async (c) => {
  const sqsClient = new SQSClient({region: 'us-east-2'})
  const sqsMessage = new SendMessageCommand({QueueUrl: 'https://sqs.us-east-2.amazonaws.com/251071362032/MyQueue.fifo', MessageBody: JSON.stringify(c.req.param()), MessageGroupId: '1', MessageDeduplicationId: '1'})
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
