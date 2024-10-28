import Question from "../models/question";
import questionRepository from "../repositories/questionRepository";

export class QuestionService {
    async createQuestion(channelId: number, text: string, fullText: string, messageLink: string, type: number, messageTs: string): Promise<Question> {
        if (text.length > 50) {
            fullText = text;
            text = text.substring(0, 50) + "...";
        }
        const user = new Question(0, channelId, text, fullText, messageLink, type, messageTs, null);
        const question = await questionRepository.create(user);
        return question;
    }

    async getQuestionById(id: number): Promise<Question | null> {
        return await questionRepository.findById(id);
    }

    async getQuestionByMessageTs(messageTs: string): Promise<Question | null> {
        return await questionRepository.findByMessageTs(messageTs);
    }

    async getAllQuestions(channelId: number): Promise<Question[]> {
        return await questionRepository.findAll(channelId);
    }

    async updateQuestion(id: number, text: string, fullText: string, messageLink: string, type: number, messageTs: string): Promise<number> {
        const question = new Question(id, 0, text, fullText, messageLink, type, messageTs, null);
        return await questionRepository.update(question);
    }

    async deleteQuestion(id: number, channelId: number): Promise<number> {
        return await questionRepository.delete(id, channelId);
    }
}

export default new QuestionService();

