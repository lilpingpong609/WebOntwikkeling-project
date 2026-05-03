export interface Anime {
    id: string;
    studio: string;
    episodes: number;
    isFinished: boolean;
}

export interface Manga {
    id: string;
    title: string;
    discription: string;
    volume: number;
    isOngoing: boolean;
    releaseDate: string;
    imageUrl: string;
    genre: string;
    themes: string[];
    anime: Anime;
}

export interface AnimeExtended {
    id: string;
    title: string;
    studio: string;
    episodes: number;
    isFinished: boolean;
    studioLocation: string;
    averageRating: number;
}
