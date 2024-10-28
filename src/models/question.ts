export enum QuestionType {
    PR = 1,
    Q = 2,
}

export default class Question {

    private _id: number;
    private _channelId: number;
    private _text: string;
    private _fullText: string;
    private _messageLink: string;
    private _type: number;
    private _messageTs: string;
    private _channelName: string | null;

    constructor(
        id: number,
        channelId: number,
        text: string,
        fullText: string,
        messageLink: string,
        type: QuestionType,
        messageTs: string,
        channelName: string | null) {
        this._id = id;
        this._channelId = channelId;
        this._text = text;
        this._fullText = fullText;
        this._messageLink = messageLink;
        this._type = type;
        this._messageTs = messageTs;
        this._channelName = channelName;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get channelId(): number {
        return this._channelId;
    }

    public set channelId(value: number) {
        this._channelId = value;
    }

    public get text(): string {
        return this._text;
    }

    public set text(value: string) {
        this._text = value;
    }

    public get fullText(): string {
        return this._fullText;
    }

    public set fullText(value: string) {
        this._fullText = value;
    }

    public get messageLink(): string {
        return this._messageLink;
    }

    public set messageLink(value: string) {
        this._messageLink = value;
    }

    public get type(): number {
        return this._type;
    }

    public set type(value: number) {
        this._type = value;
    }

    public get messageTs(): string {
        return this._messageTs;
    }

    public set messageTs(value: string) {
        this._messageTs = value;
    }

    public get channelName(): string | null {
        return this._channelName;
    }

    public set channelName(value: string) {
        this._channelName = value;
    }

    public get questionType(): string {
        return QuestionType[this.type];
    }
}