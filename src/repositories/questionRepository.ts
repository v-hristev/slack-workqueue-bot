import { db } from "../datastore/database";
import Question from "../models/question";

export class QuestionRepository {
    constructor() {
        this.init();
    }

    private init() {
        const query = `
            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                channelId INTEGER NOT NULL,
                text TEXT NOT NULL UNIQUE,
                fullText TEXT NOT NULL,
                messageLink TEXT NOT NULL,
                type INTEGER NOT NULL,
                message_ts TEXT NOT NULL
            )`;

        db.run(query, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            }
        });
    }

    // Create a new channel
    public create(question: Question): Promise<Question> {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO questions (channelId, text, fullText, messageLink, type, message_ts) VALUES (?, ?, ?, ?, ?, ?)`;
            db.run(query, [question.channelId, question.text, question.fullText, question.messageLink, question.type, question.messageTs], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Question(
                        this.lastID,
                        question.channelId,
                        question.text,
                        question.fullText,
                        question.messageLink,
                        question.type,
                        question.messageTs,
                        question.channelName));
                }
            });
        });
    }

    // Find a question by ID
    public findById(id: number): Promise<Question | null> {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM questions WHERE id = ?`;
            db.get(query, [id], (err, row: Question) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(new Question(row.id, row.channelId, row.text, row.fullText, row.messageLink, row.type, row.messageTs, null));
                } else {
                    resolve(null);
                }
            });
        });
    }

    // Find a question by Text
    public findByText(text: string): Promise<Question | null> {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM questions WHERE text = ?`;
            db.get(query, [text], (err, row: Question) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(new Question(row.id, row.channelId, row.text, row.fullText, row.messageLink, row.type, row.messageTs, null));
                } else {
                    resolve(null);
                }
            });
        });
    }

    // Find a question by MessageTs
    public findByMessageTs(messageTs: string): Promise<Question | null> {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM questions WHERE message_ts = ? LIMIT 1`;
            db.get(query, [messageTs], (err, row: Question) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(new Question(row.id, row.channelId, row.text, row.fullText, row.messageLink, row.type, row.messageTs, null));
                } else {
                    resolve(null);
                }
            });
        });
    }

    // Get all questions
    public findAll(channelId: number): Promise<Question[]> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT q.*, c.name AS channelName
                FROM questions AS q
                INNER JOIN channels AS c ON c.id = q.channelId
                WHERE q.channelId = ?
            `;
            db.all(query, [channelId], (err, rows: Question[]) => {
                if (err) {
                    reject(err);
                } else {
                    const questions = rows.map(row =>
                        new Question(
                            row.id,
                            row.channelId,
                            row.text,
                            row.fullText,
                            row.messageLink,
                            row.type,
                            row.messageTs,
                            row.channelName));
                    resolve(questions);
                }
            });
        });
    }

    // Update a question
    public update(question: Question): Promise<number> {
        return new Promise((resolve, reject) => {
            const query = `UPDATE questions SET text = ?, fullText = ?, type = ? WHERE id = ?`;
            db.run(query, [question.text, question.fullText, question.type, question.id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    // Delete a question
    public delete(id: number, channelId: number): Promise<number> {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM questions WHERE id = ? AND channelId = ?`;
            db.run(query, [id, channelId], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }
}

export default new QuestionRepository();
