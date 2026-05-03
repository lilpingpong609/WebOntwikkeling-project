import express from "express";
import path from "path";
import { Manga } from "./interfaces";
import { connectDB, getMangaCollection } from "./database";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.urlencoded({ extended: true }));

async function seedIfEmpty(): Promise<void> {
    const col = getMangaCollection();
    const count = await col.countDocuments();
    if (count === 0) {
        const res = await fetch(
            "https://raw.githubusercontent.com/lilpingpong609/WebOntwikkeling-project/main/json/manga.json"
        );
        const data = (await res.json()) as Manga[];
        await col.insertMany(data);
        console.log(` ${data.length} manga's opgeslagen in MongoDB`);
    }
}

app.get("/", async (req, res) => {
    try {
        const col = getMangaCollection();
        const search = (req.query.search as string) || "";
        const sortField = (req.query.sort as string) || "title";
        const sortOrder = (req.query.order as string) || "asc";

        const query = search ? { title: { $regex: search, $options: "i" } } : {};
        const sortDir = sortOrder === "asc" ? 1 : -1;

        const mangaList = await col.find(query).sort({ [sortField]: sortDir }).toArray();
        res.render("index", { title: "Manga Overzicht", mangaList, search, sortField, sortOrder });
    } catch (err) {
        res.status(500).send("Serverfout");
    }
});

app.get("/manga/:id", async (req, res) => {
    try {
        const manga = await getMangaCollection().findOne({ id: req.params.id });
        if (!manga) return void res.status(404).send("Manga niet gevonden");
        res.render("detail", { title: manga.title, manga });
    } catch (err) {
        res.status(500).send("Serverfout");
    }
});

app.get("/manga/:id/edit", async (req, res) => {
    try {
        const manga = await getMangaCollection().findOne({ id: req.params.id });
        if (!manga) return void res.status(404).send("Manga niet gevonden");
        res.render("edit", { title: `Edit: ${manga.title}`, manga });
    } catch (err) {
        res.status(500).send("Serverfout");
    }
});

app.post("/manga/:id/edit", async (req, res) => {
    try {
        const { title, genre, volume, isOngoing, releaseDate, discription } = req.body;
        await getMangaCollection().updateOne(
            { id: req.params.id },
            {
                $set: {
                    title,
                    genre,
                    volume: parseInt(volume, 10),
                    isOngoing: isOngoing === "true",
                    releaseDate,
                    discription,
                },
            }
        );
        res.redirect(`/manga/${req.params.id}`);
    } catch (err) {
        res.status(500).send("Update mislukt");
    }
});

app.get("/anime/:id", async (req, res) => {
    try {
        const manga = await getMangaCollection().findOne({ "anime.id": req.params.id });
        if (!manga) return void res.status(404).send("Anime niet gevonden");
        res.render("anime-details", { title: manga.anime.id, anime: manga.anime, manga });
    } catch (err) {
        res.status(500).send("Serverfout");
    }
});

app.get("/manga", (_req, res) => res.redirect("/"));

async function start() {
    await connectDB();
    await seedIfEmpty();
    app.listen(PORT, () => console.log(`Server draait op http://localhost:${PORT}`));
}

start();