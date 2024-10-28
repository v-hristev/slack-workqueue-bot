import Channel from "../models/channel";
import channelRepository from "../repositories/channelRepository";

export class ChannelService {
    async createChannel(name: string): Promise<Channel> {
        const user = new Channel(0, name);
        const channel = await channelRepository.create(user);
        return channel;
    }

    async getChannelById(id: number): Promise<Channel | null> {
        return await channelRepository.findById(id);
    }

    async getChannelByName(name: string): Promise<Channel | null> {
        return await channelRepository.findByName(name);
    }

    async getOrCreateChannelByName(name: string): Promise<Channel> {
        const channel = await channelRepository.findByName(name);
        if (channel) {
            return channel;
        }
        return await this.createChannel(name);
    }

    async getAllChannels(): Promise<Channel[]> {
        return await channelRepository.findAll();
    }

    async updateChannel(id: number, name: string): Promise<number> {
        const channel = new Channel(id, name);
        return await channelRepository.update(channel);
    }

    async deleteChannel(id: number): Promise<number> {
        return await channelRepository.delete(id);
    }
}

export default new ChannelService();
