export default interface MediaListItem {
    id: number;
    title: string;
    filePath: string;
    duration: number;
    durationPlayed: number;
    releaseDate: Date;
    thumbnailUrl: string
    overview: string
}