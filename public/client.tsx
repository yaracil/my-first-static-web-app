import {ChatClient, SendMessageOptions} from '@azure/communication-chat';
import {AzureCommunicationTokenCredential} from '@azure/communication-common';

// Your unique Azure Communication service endpoint
let endpointUrl = 'https://chat-quickstart.communication.azure.com/';
// The user access token generated as part of the pre-requisites
let userAccessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOmE1NjgxMzkwLTIzMzYtNDc2ZS1iN2M4LTViODdjOWZiYTk0YV8wMDAwMDAxMi1mNmQ5LTkwZWQtZWVmMC04YjNhMGQwMDllYTYiLCJzY3AiOjE3OTIsImNzaSI6IjE2NTkzMTY0NjQiLCJleHAiOjE2NTk0MDI4NjQsImFjc1Njb3BlIjoiY2hhdCIsInJlc291cmNlSWQiOiJhNTY4MTM5MC0yMzM2LTQ3NmUtYjdjOC01Yjg3YzlmYmE5NGEiLCJpYXQiOjE2NTkzMTY0NjR9.AB3T_3x5oSHB1wyWeMMJuCramqGpMj7KO2TtiRnxy2568Xhg7nJai9wotM1FgDkwkhGqCvsH-XcmHV_JOJHZq3bwAKygZqsZ14U26XtXnve4gLLXOO0lC_wI-F1mT1xiAl5TnzG2HKZBmorxWkE_EeEn-yUI4MpYFt_nQimWEOjoe8BrOx823x1VQnmFDTh7DmyEg8TFhc6EoWfv1nbNuocjeqaSf6LxTfmQAXH_dpDyNQmkUsMb4qvpwy1bLB9AtNk-Uti4OfTOGXBi2-nobHYSFow-ZCq6FjlTZlTbnMqBRb_eD6-TVjKb9IxkIfSogUIkXS3CF0-xRGlwbTlp6A';

let chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAccessToken));
console.log('Azure Communication Chat client created!');

async function createChatThread() {
    const createChatThreadRequest = {
        topic: "Hello, World!"
    };
    const createChatThreadOptions = {
        participants: [
            {
                id: {communicationUserId: '8:acs:a5681390-2336-476e-b7c8-5b87c9fba94a_00000012-f6d9-90ed-eef0-8b3a0d009ea6'},
                displayName: 'Yoelkys'
            }
        ]
    };
    const createChatThreadResult = await chatClient.createChatThread(
        createChatThreadRequest,
        createChatThreadOptions
    );
    return createChatThreadResult?.chatThread?.id;
}

createChatThread().then(async threadId => {
    console.log(`Thread created:${threadId}`);
    // PLACEHOLDERS
    // <CREATE CHAT THREAD CLIENT>
    let chatThreadClient;
    if (threadId != null) {
        let chatThreadClient = chatClient.getChatThreadClient(threadId);

        console.log(`Chat Thread client for threadId:${threadId}`);

        // const threads = chatClient.listChatThreads();
        // for await (const thread of threads) {
        //     // your code here
        // }
        // <RECEIVE A CHAT MESSAGE FROM A CHAT THREAD>
        // open notifications channel
        await chatClient.startRealtimeNotifications();
        // subscribe to new notification
        chatClient.on("chatMessageReceived", (e) => {
            console.log("Notification chatMessageReceived!");
            // your code here
        });

        // <SEND MESSAGE TO A CHAT THREAD>
        const sendMessageRequest =
            {
                content: 'Please take a look at the attachment'
            };
        const sendMessageOptions: SendMessageOptions =
            {
                senderDisplayName: 'Jack',
                type: 'text',
                metadata: {
                    'hasAttachment': 'true',
                    'attachmentUrl': 'https://contoso.com/files/attachment.docx'
                }
            };
        const sendChatMessageResult = await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
        const messageId = sendChatMessageResult.id;
        console.log(`Message sent!, message id:${messageId}`);

        // <LIST MESSAGES IN A CHAT THREAD>
        const messages = chatThreadClient.listMessages();
        for await (const message of messages) {
            // your code here
        }
        // <ADD NEW PARTICIPANT TO THREAD>
        // const addParticipantsRequest =
        //     {
        //         participants: [
        //             {
        //                 id: { communicationUserId: '<NEW_PARTICIPANT_USER_ID>' },
        //                 displayName: 'Jane'
        //             }
        //         ]
        //     };
        //
        // await chatThreadClient.addParticipants(addParticipantsRequest);

        // <LIST PARTICIPANTS IN A THREAD>
        const participants = chatThreadClient.listParticipants();
        for await (const participant of participants) {
            // your code here
        }

        // <REMOVE PARTICIPANT FROM THREAD>
        // await chatThreadClient.removeParticipant({ communicationUserId: <PARTICIPANT_ID> });
        //         await listParticipants();

        // subscribe to realTimeNotificationConnected event
        chatClient.on('realTimeNotificationConnected', () => {
            console.log("Real time notification is now connected!");
            // your code here
        });
// subscribe to realTimeNotificationDisconnected event
        chatClient.on('realTimeNotificationDisconnected', () => {
            console.log("Real time notification is now disconnected!");
            // your code here
        });
    }
});
