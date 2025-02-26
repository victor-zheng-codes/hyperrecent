import prisma from '../utils/prisma-client';
import fetch from 'node-fetch';

/**
 * Interface representing metadata messages from the fetched data.
 */
interface Message {
    status: string; // Status of the request
    interval: string; // Interval of the request
    cursor: string; // Current cursor for pagination
    count: number; // Number of publications in the current page
    count_new_papers: string; // Number of new publications
    total: number; // Total number of publications
}

/**
 * Interface representing the structure of each publication item in the fetched data.
 */
interface CollectionItem {
    doi: string; // Digital Object Identifier for the article
    title: string; // Title of the article
    authors: string; // List of authors in a semicolon-separated string
    author_corresponding: string; // Corresponding author's name
    author_corresponding_institution: string; // Institution of the corresponding author
    date: string; // Publication date (Most Recent ISO 8601 date)
    version: string; // Version of the Preprint (Some Authors have multiple updated versions of the same preprint)
    type: string; // Type of the publication
    license: string; // License information
    category: string; // Category or field of study (e.g., "Bioinformatics")
    jatsxml: string; // XML representation of the article
    abstract: string; // Abstract of the article
    published: string; // Publication status (e.g., "NA" for preprints)
    server: string; // Server where the article is hosted (e.g., "bioRxiv")
}

/**
 * Interface representing the data structure returned by the API.
 */
interface PageData {
    collection: CollectionItem[]; // Array of publications
    messages: Message[]; // Metadata messages
}

/**
 * Main function to fetch and process publications from bioRxiv and medRxiv APIs.
 * Fetches data for the last two days, processes each page, and seeds the data into the database.
 */
async function updatePublications() {
    // Get today's date and yesterday's date
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); //update to fetch data for yesterday

    // To fetch more dates, you can simply add dates to the array. But these dates must be ISO 8601 format.
    const dates = [today, yesterday];

    // Iterate over each date and fetch data from bioRxiv and medRxiv APIsoi
    for (const date of dates) {
        // Format the date to ISO format
        const formattedDate = date.toISOString().split('T')[0];
        console.log(`Processing data for date: ${formattedDate}`);

        // API URLs for bioRxiv and medRxiv
        const biorxivURL = `https://api.biorxiv.org/details/biorxiv/${formattedDate}/${formattedDate}/`;
        const medrxivURL = `https://api.medrxiv.org/details/biorxiv/${formattedDate}/${formattedDate}/`;

        const baseURLS = [biorxivURL, medrxivURL];

        // Retry configuration for failed requests to prevent seeding failures
        const MAX_RETRIES = 10;
        const RETRY_DELAY_MS = 2000;

        // Iterate over each base URL and fetch data
        for (const baseURL of baseURLS) {
            console.log(`Starting data fetch and seeding for: ${baseURL}`);

            let cursor = 0; // Pagination cursor
            const pageSize = 100;
            let totalPublications: number | null = null;

            // Iterate over cursor until all publications are fetched
            while (totalPublications === null || cursor < totalPublications) {
                // Construct the page URL with base url and cursor
                const pageURL = `${baseURL}${cursor}`;
                // Increment the cursor
                cursor += pageSize;

                let retryCount = 0;

                // Retry fetching the page data if it fails until the maximum retries
                while (retryCount < MAX_RETRIES) {
                    try {
                        // Fetch the page data
                        const response = await fetch(pageURL, {
                            method: 'GET',
                            headers: { 'Accept': 'application/json' },
                        });

                        // Throw an error if the response is not successful
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const pageData = (await response.json()) as PageData;

                        // Seed the data into the database
                        await prismaSeeder(pageData); 

                        // Update the total publications 
                        totalPublications = totalPublications || pageData.messages[0]?.total;
                        console.log(`Processed page starting at cursor ${cursor - pageSize}`);
                        break; // Exit retry loop if successful
                    } catch (error) { // Upon failure, retry fetching the page
                        retryCount++;
                        console.error(`Error fetching page (Attempt ${retryCount}/${MAX_RETRIES}):`, error);

                        if (retryCount >= MAX_RETRIES) {
                            console.error(`Failed after ${MAX_RETRIES} attempts, moving to next page.`);
                            break;
                        }

                        // Delay before retrying
                        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    }
                }
            }

            console.log(`Data fetch and seeding completed for: ${baseURL}`);
        }
    }
}

/**
 * Seeds the fetched publication data into the database.
 * Ensures that authors and topics are created if they don't exist.
 *
 * @param data - The page data to process and seed into the database.
 */
async function prismaSeeder(data: PageData) {
    // Iterate over each article in the collection
    for (const article of data.collection) {
        // Process each article and seed it into the database
        try {
            // Article is a preprint if it's not published and marked as "NA"
            const preprintStatus = article.published === "NA";

            // Parse authors into first and last authors
            const authorsArray = article.authors.split(';').map((author: string) => author.trim());
            const firstAuthor = authorsArray.length > 0 ? authorsArray[0].trim() : null;
            const lastAuthor = authorsArray.length > 0 ? authorsArray[authorsArray.length - 1].trim() : null;

            // Find the first author
            let firstAuthorExists = await prisma.author.findFirst({
                where: { firstName: firstAuthor?.split(',')[0], lastName: firstAuthor?.split(',')[1] },
            });

            // Find or create the first author
            let firstAuthorId = firstAuthorExists
                ? firstAuthorExists.authorId
                : (
                      await prisma.author.create({
                          data: {
                              firstName: String(firstAuthor?.split(',')[0]),
                              lastName: String(firstAuthor?.split(',')[1]),
                          },
                      })
                  ).authorId;

            // Retrieve the last author
            let lastAuthorExists = await prisma.author.findFirst({
                where: { firstName: lastAuthor?.split(',')[0], lastName: lastAuthor?.split(',')[1] },
            });

            // Find or create the last author
            let lastAuthorId = lastAuthorExists
                ? lastAuthorExists.authorId
                : (
                      await prisma.author.create({
                          data: {
                              firstName: String(lastAuthor?.split(',')[0]),
                              lastName: String(lastAuthor?.split(',')[1]),
                          },
                      })
                  ).authorId;

            // Check if the article already exists
            const articleExists = await prisma.article.findUnique({
                where: {
                    uniqueVersion: {
                        link: article.doi,
                        version: Number(article.version),
                    },
                },
            });

            // Create the new article if it doesn't exist
            if (!articleExists) {
                // Create the new article
                const newArticle = await prisma.article.create({
                    data: {
                        title: article.title,
                        authorList: article.authors,
                        firstAuthorId,
                        lastAuthorId,
                        server: article.server,
                        institution: article.author_corresponding_institution,
                        date: new Date(article.date).toISOString(),
                        link: article.doi,
                        abstract: article.abstract,
                        isPreprint: preprintStatus,
                        version: parseInt(article.version),
                        slug: article.doi,
                    },
                });

                // Find or create the topic
                let topic = await prisma.topic.findFirst({
                    where: { name: article.category },
                });

                if (!topic) {
                    topic = await prisma.topic.create({
                        data: { name: article.category },
                    });
                }

                // Associate the article with the topic
                await prisma.articleTopic.create({
                    data: {
                        articleId: newArticle.articleId,
                        topicId: topic.topicId,
                    },
                });
            }
        } catch (error) {
            console.error(`Error processing article "${article.title}":`, error);
        }
    }
    console.log('Database seeded successfully!');
}


// If you want to fetch data for a specific date range, you can use the following code snippet:
// Base URL for pagination (replace dates as needed)
const startDate = "2024-11-10";
const endDate = "2024-11-11";
const baseURL = `https://api.biorxiv.org/details/biorxiv/${startDate}/${endDate}/`;
// const baseURL = `https://api.medrxiv.org/details/biorxiv/${startDate}/${endDate}/`;

// Retry configuration
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 2000;

async function fetchPublications() {
    console.log("Starting data fetch and seeding..." + baseURL);

    let cursor = 0;
    const pageSize = 100;
    let totalPublications = null;

    while (totalPublications === null || cursor < totalPublications) {
        const pageURL = `${baseURL}${cursor}`;
        cursor += pageSize; // Increment cursor for next page
        let retryCount = 0;

        while (retryCount < MAX_RETRIES) {
            try {
                const response = await fetch(pageURL, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const pageData = await response.json() as PageData;
                await prismaSeeder(pageData); // Seed the data in this batch

                totalPublications = totalPublications || pageData.messages[0]?.total;
                console.log(`Processed page starting at cursor ${cursor - pageSize}`);
                break; // Exit retry loop if successful

            } catch (error) {
                retryCount++;
                console.error(`Error fetching page (Attempt ${retryCount}/${MAX_RETRIES}):`, error);

                if (retryCount >= MAX_RETRIES) {
                    console.error(`Failed after ${MAX_RETRIES} attempts, moving to next page.`);
                    break;
                }

                // Delay before retrying
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            }
        }
    }

    console.log("Data fetch and seeding completed.");
}

// Run the function
updatePublications();