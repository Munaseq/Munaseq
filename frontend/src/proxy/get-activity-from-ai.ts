"use server";
import OpenAI from "openai";

export async function getActivityFromAi({
    title,
    description,
    extraInstructions,
}: {
    title: string;
    description?: string;
    extraInstructions: string;
}) {
    const openai = new OpenAI();
    try {
        const myAssistant = await openai.beta.assistants.retrieve(
            "asst_La6D1ulA6rFmwNWRg8Y8i28L"
        );

        const thread = await openai.beta.threads.create();

        const message = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: `{
            "title": "${title}",
            "description": "${description}",
            "extra_instructions": "${extraInstructions}"
            }`,
        });

        let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: myAssistant.id,
        });

        if (run.status !== "completed") {
            throw new Error("Thread run failed");
        }

        const messages = await openai.beta.threads.messages.list(run.thread_id);

        if ((messages.data[0].content[0] as any).text.value) {
            return await JSON.parse((messages.data[0].content[0] as any).text.value);
        }

        throw new Error("No messages found in the thread run");
    } catch (error) {
        console.error("Error retrieving assistant:", error);
        return [];
    }
}
