import { db } from "../datastore/database";
import Channel from "../models/channel";

export class ChannelRepository {
    constructor() {
        this.init();
    }

    private init() {
        const query = `
            CREATE TABLE IF NOT EXISTS channels (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT
            )`;

        db.run(query, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            }
        });
    }

    // Create a new channel
    public create(channel: Channel): Promise<Channel> {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO channels (name) VALUES (?)`;
            db.run(query, [channel.name], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Channel(this.lastID, channel.name));
                }
            });
        });
    }

    // Find a channel by ID
    public findById(id: number): Promise<Channel | null> {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM channels WHERE id = ?`;
            db.get(query, [id], (err, row: Channel) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(new Channel(row.id, row.name));
                } else {
                    resolve(null);
                }
            });
        });
    }

    // Find a channel by Name
    public findByName(name: string): Promise<Channel | null> {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM channels WHERE name = ?`;
            db.get(query, [name], (err, row: Channel) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(new Channel(row.id, row.name));
                } else {
                    resolve(null);
                }
            });
        });
    }

    // Get all channels
    public findAll(): Promise<Channel[]> {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM channels`;
            db.all(query, [], (err, rows: Channel[]) => {
                if (err) {
                    reject(err);
                } else {
                    const channels = rows.map(row => new Channel(row.id, row.name));
                    resolve(channels);
                }
            });
        });
    }

    // Update a channel
    public update(channel: Channel): Promise<number> {
        return new Promise((resolve, reject) => {
            const query = `UPDATE channels SET name = ? WHERE id = ?`;
            db.run(query, [channel.name, channel.id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    // Delete a channel
    public delete(id: number): Promise<number> {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM channels WHERE id = ?`;
            db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }
}

export default new ChannelRepository();
