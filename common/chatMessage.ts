export interface Message {
    text: string;
    roomId: string;
    isSender: boolean;
    isSystem: boolean;
    name: string;
}

