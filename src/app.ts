import { App } from "@slack/bolt";
import * as dotenv from "dotenv";
import channelService from "./services/channelService";
import questionService from "./services/questionService";
import { PullRequestService } from "./services/pullRequestService";
import Question, { QuestionType } from "./models/question";

dotenv.config();

// Initialize your Bolt app
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

const pullRequestService = new PullRequestService(process.env.GITHUB_TOKEN);

app.message("!wadd ", async ({ message, say }: any) => {
    if (message && (message.text || "").indexOf("!wadd ") == 0) {
        const value = message.text.substring("!wadd ".length).trim();
        const { owner, repo, prNumber } = pullRequestService.extractRepoAndPR(value);
        const prData = await pullRequestService.fetchPR(owner, repo, prNumber);
        console.log('prData', prData);
        console.log({
            PR_Number: prData.number,
            Title: prData.title,
            Author: prData.user.login,
            State: prData.state,
            Created_At: prData.created_at,
            Branch: prData.head.ref,
            Base_Branch: prData.base.ref,
            Summary: prData.body
        });
        await saveQuestion(value, message, say, QuestionType.PR);
    }
});

app.message("!q ", async ({ message, say }: any) => {
    if (message && (message.text || "").indexOf("!q ") == 0) {
        const value = message.text.substring("!q ".length).trim();
        await saveQuestion(value, message, say, QuestionType.Q);
    }
});

app.message("!wdone", async ({ message, say }: any) => {
    await handleQuestionRemoval(message, say, "!wdone", ":white_check_mark:");
});

app.message("!wbounce", async ({ message, say }: any) => {
    await handleQuestionRemoval(message, say, "!wbounce", ":speech_balloon:");
});

app.message("!w", async ({ message, say }: any) => {
    if (message && message.text == "!w") {
        const channel = await channelService.getOrCreateChannelByName(message.channel);
        const questions = await questionService.getAllQuestions(channel.id);
        await say({
            text: questions.length > 0
                ? questions.map(q => generateMessage(q)).join("\n\n")
                : ":raised_hands: The queue is empty!",
            thread_ts: message.thread_ts || message.ts  // Reply in the same thread
        });
    }
});

async function handleQuestionRemoval(message: any, say: any, keyword: string, emoji: string) {
    if (message && (message.text || "").indexOf(keyword) == 0) {
        const question = await getQuestion(message, keyword);
        if (question) {
            const channel = await channelService.getChannelByName(message.channel);
            if (channel) {
                const result = await questionService.deleteQuestion(question.id, channel.id);
                if (result > 0) {
                    await say({
                        text: `${emoji} *${QuestionType[question.type]}${question.id}*: ${question.text}\n`,
                        thread_ts: message.thread_ts || message.ts
                    });
                }
            }
        }
    }
}

async function saveQuestion(value: string, message: any, say: any, questionType: QuestionType) {
    const permalinkResponse = await app.client.chat.getPermalink({
        channel: message.channel,
        message_ts: message.ts
    });

    const permalink = permalinkResponse?.permalink || "";
    const channel = await channelService.getOrCreateChannelByName(message.channel);
    const [question, isNew] = await questionService.createQuestion(channel.id, value, "", permalink, questionType, message.ts);

    await say({
        text: isNew ? `*${QuestionType[questionType]}${question.id}*: ${question.text}` : generateMessage(question),
        thread_ts: isNew ? message.thread_ts || message.ts : null
    });
}

async function getQuestion(message: any, keyword: string): Promise<Question | null> {
    const value = message.text.substring(keyword.length).trim();
    if (value) {
        const questionId = extractQuestionId(value);
        return questionId != null
            ? await questionService.getQuestionById(questionId)
            : null;
    }

    const threadTs = message.thread_ts;
    return await questionService.getQuestionByMessageTs(threadTs);
}

function extractQuestionId(value: string): number | null {
    let num = value.toUpperCase().indexOf(QuestionType[QuestionType.PR]) == 0
        ? +value.toUpperCase().substring(QuestionType[QuestionType.PR].length)
        : +value;
    if (!isNaN(num)) return num;

    num = +value.toUpperCase().substring(QuestionType[QuestionType.Q].length);
    return !isNaN(num) ? num : null;
}

function generateMessage({ id, text, fullText, messageLink, type }: Question): string {
    return `${QuestionType[type]}${id}: ${text} \`<${messageLink}|View>\`` + (
        fullText.length > 0 ? `\n${fullText}` : ""
    );
}

// Respond to mentions (e.g., "@bot hello")
app.event("app_mention", async ({ event, say }) => {
    console.log("Event received:", event);  // Logging the message object for debugging
    await say(`Hello <@${event.user}>! How can I assist you?`);
});

// Start your app
(async () => {
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ Slack Bolt app is running!");
})();