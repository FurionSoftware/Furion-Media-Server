export default interface MediaDetail {
    id: number;
    title: string;
    filePath: string;
    duration: number;
    durationPlayed: number;
    releaseDate: Date;
    thumbnailUrl: string;
    overview: string;
    audio: string;
    codec: string;
    quality: string;
    language: string;
    resolution: string;
}
