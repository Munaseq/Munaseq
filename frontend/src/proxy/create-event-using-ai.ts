"use server";
import OpenAI from "openai";
export async function createEventUsingAi(formData: FormData) {
    const openai = new OpenAI();
    let uploadedFile;
    try {
        const image = formData.get("image") as File;
        const extraInstructions = formData.get("extraInstructions") as string;
        if (!image) {
            throw new Error("Image and extra instructions are required");
        }
        const myAssistant = await openai.beta.assistants.retrieve(
            "asst_7dUwksfLTFrqElOs7ud7MYn3"
        );
        const thread = await openai.beta.threads.create();
       
        // Upload file to OpenAI
        uploadedFile = await openai.files.create({
            file: image,
            purpose: "vision",
        });
        
        // Create message with the image and instructions
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content : extraInstructions ? [
                {
                    type: "text",
                    text: extraInstructions,
                },
                {
                    type: "image_file",
                    image_file: { file_id: uploadedFile.id },
                },
            ] : [
                {
                    type: "image_file",
                    image_file: { file_id: uploadedFile.id },
                },
            ]
        });
       
        // Run the assistant
        const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: myAssistant.id,
        });
        if (run.status !== "completed") {
            throw new Error("Thread run failed");
        }
        // Retrieve the messages
        const messages = await openai.beta.threads.messages.list(run.thread_id);
        const messageContent = messages.data[0]?.content?.[0] as any;
        if (messageContent?.text?.value) {
            return JSON.parse(messageContent.text.value);
        }
        throw new Error("No valid response message found");
    } catch (error) {
        // Cleanup if error occurred and file was uploaded
        if (uploadedFile) {
            try {
                await openai.files.del(uploadedFile.id);
                console.log(`Cleaned up file: ${uploadedFile.id}`);
            } catch (cleanupError) {
                console.error("Error cleaning up file:", cleanupError);
            }
        }
        
        console.error("Error in createEventUsingAi:", error);
        return {error: "An error occurred while processing your request."};
    }
}