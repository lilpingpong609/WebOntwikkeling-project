import readline from "readline";
import fs from "fs";
import path from "path";
import { Manga } from "./interfaces";

// Load manga data from manga.json
const mangaData: Manga[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../json/manga.json"), "utf-8")
);

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Helper to ask a question and get user input
function ask(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

// Display all manga titles in short overview
function displayAll(): void {
    console.log("\n--- All Manga ---");
    mangaData.forEach((manga) => {
        console.log(`- ${manga.title} (${manga.id})`);
    });
    console.log();
}

// Display full details for one manga
function displayById(id: string): void {
    const manga = mangaData.find((m) => m.id === id);

    if (!manga) {
        console.log(`\nNo manga found with ID "${id}". Please try again.\n`);
        return;
    }

    console.log(`\n- ${manga.title} (${manga.id})`);
    console.log(`  - Description: ${manga.discription}`);
    console.log(`  - Volume: ${manga.volume}`);
    console.log(`  - Ongoing: ${manga.isOngoing}`);
    console.log(`  - Release Date: ${manga.releaseDate}`);
    console.log(`  - Genre: ${manga.genre}`);
    console.log(`  - Themes: ${manga.themes.join(", ")}`);
    console.log(`  - Image: ${manga.imageUrl}`);
    console.log(`  - Anime:`);
    console.log(`    - Studio: ${manga.anime.studio}`);
    console.log(`    - Episodes: ${manga.anime.episodes}`);
    console.log(`    - Finished: ${manga.anime.isFinished}`);
    console.log();
}

// Main menu loop
async function main(): Promise<void> {
    console.log("\nWelcome to the JSON data viewer!\n");

    let running = true;

    while (running) {
        console.log("1. View all data");
        console.log("2. Filter by ID");
        console.log("3. Exit");

        const choice = await ask("\nPlease enter your choice: ");

        if (choice === "1") {
            displayAll();
        } else if (choice === "2") {
            const id = await ask("Please enter the ID you want to filter by: ");
            displayById(id);
        } else if (choice === "3") {
            console.log("\nGoodbye!\n");
            running = false;
        } else {
            console.log("\nInvalid choice. Please enter 1, 2 or 3.\n");
        }
    }

    rl.close();
}

main();