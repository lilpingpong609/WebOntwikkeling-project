import { MongoClient, Collection, Db } from "mongodb";
import { Manga } from "./interfaces";

const uri = "mongodb+srv://opongnana040_db_user:RgXw6CZ8F3c2Skcx@cluster0.mfmnidk.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);
let db: Db;

export async function connectDB(): Promise<void> {
    await client.connect();
    db = client.db("mangadb");
    console.log(" Verbonden met MongoDB");
}

export function getMangaCollection(): Collection<Manga> {
    return db.collection<Manga>("manga");
}