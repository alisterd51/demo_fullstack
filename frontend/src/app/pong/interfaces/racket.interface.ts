export interface IRacket {
    playerName: string;
    backgroundColor: string;
    top: number;
    left: number;
    height: number;
    width: number;
    toUp: boolean;
    toDown: boolean;
    toUpKey: string;//a ajouter au param
    toDownKey: string;//a ajouter au param
    levelAi: number;
    mode: string;
    uid: number;//a ajouter au param
}
