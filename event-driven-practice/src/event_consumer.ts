
import {ReceiveMessageCommand, SQSClient, DeleteMessageCommand} from '@aws-sdk/client-sqs'

const sqsClient = new SQSClient({ region: "us-east-2" });
const queueUrl = "https://sqs.us-east-2.amazonaws.com/251071362032/MyQueue";

async function startPoll() {

    while(true){
        console.log("Polling...")
        
        try{
            const out = await sqsClient.send(new ReceiveMessageCommand({
                QueueUrl: queueUrl,
                WaitTimeSeconds: 5,
                MaxNumberOfMessages: 10
            }))

            if (out.Messages) {
                console.log("found message")
                for (const message of out.Messages) {
                // Process message
                console.log("Processing:", message.Body);

                // Delete after processing
                await sqsClient.send(new DeleteMessageCommand({
                    QueueUrl: queueUrl,
                    ReceiptHandle: message.ReceiptHandle
                }));
                }
            }
        } catch (err) {
            console.error("Polling Error:", err);
            await new Promise(r => setTimeout(r, 5000)); // Backoff on error
            }

        setTimeout(() => {}, 1000)    
    }

}

startPoll().catch(err => {
  console.error("Fatal Error:", err);
  process.exit(1);
});