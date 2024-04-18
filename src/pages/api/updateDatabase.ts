import type { Request, Response } from 'astro';
import { Client, Databases, ID, Query } from 'node-appwrite';

export async function POST({ request }: { request: Request }) {
  const client = new Client();
  const databases = new Databases(client);

  client
    .setEndpoint(import.meta.env.APPWRITE_ENDPOINT)
    .setProject(import.meta.env.APPWRITE_PROJECT_ID)
    .setKey(import.meta.env.APPWRITE_PVT_KEY);

  try {
    const db_appwrite_id = import.meta.env.APPWRITE_DATABASE_ID;
    // Extract the required data from the request body
    const { user_name, response42 } = await request.json();

    try {
      await databases.getCollection(db_appwrite_id, user_name);
    } catch {
      try {
        await databases.createCollection(db_appwrite_id, user_name, user_name);

        // Create string attributes in the collection
        await Promise.all([
          databases.createStringAttribute(db_appwrite_id, user_name, 'user_message', 5000, false),
          databases.createStringAttribute(db_appwrite_id, user_name, 'assistant_message', 5000, false),
          databases.createStringAttribute(db_appwrite_id, user_name, 'products', 900, false),
          databases.createStringAttribute(db_appwrite_id, user_name, 'icebreakers', 500, false),
        ]);
      } catch (error) {
        console.error('Error in creating collection', error);
      }
    }

    try {
      // Create a new document
      const result = await databases.createDocument(
        db_appwrite_id,
        user_name,
        ID.unique(),
        {
          'user_message': response42?.user,
          'assistant_message': String(response42?.ai),
          'products': String(response42?.products).replace(/,/g, ", "),
          'icebreakers': String(response42?.icebreakers).replace(/,/g, ", "),
        }
      );

      return new Response(JSON.stringify(result), {
        status: 201,
        content: result,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error in updating collection', error);
      return new Response(JSON.stringify({ error: 'Error in updating collection' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
