import { createClient } from '@sanity/client'

export const client = createClient({
    projectId: 't44dx57v',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false, // Turn off CDN for fresh data
})

async function testFetch() {
    console.log("Fetching posts...");
    try {
        const posts = await client.fetch(`*[_type == "newsPost"]{title, _id, status}`);
        console.log("Posts found:", posts.length);
        console.log(posts);
    } catch (error) {
        console.error("Error fetching:", error.message);
    }
}

testFetch();
