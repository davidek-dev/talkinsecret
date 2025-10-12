import fetch from 'node-fetch';

export const handler = async function(event, context) {
  const { CONTENTFUL_SPACE_ID, CONTENTFUL_DELIVERY_TOKEN } = process.env;

  // Check if environment variables are set
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_DELIVERY_TOKEN) {
    console.error('Missing Contentful credentials');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing Contentful credentials' }),
    };
  }

  // Log environment variables to check if they are loaded
  console.log('CONTENTFUL_SPACE_ID:', CONTENTFUL_SPACE_ID);
  console.log('CONTENTFUL_DELIVERY_TOKEN:', CONTENTFUL_DELIVERY_TOKEN ? 'Loaded' : 'Not Loaded');


  const url = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}/`;

  const query = `
    query {
      gigsCollection(order: date_ASC, where: { date_gte: "${new Date().toISOString()}" }) {
        items {
          date
          city
          venue
          ticketsUrl
        }
      }
    }
  `;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONTENTFUL_DELIVERY_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch data from Contentful' }),
      };
    }

    const data = await response.json();
    const gigs = data.data.gigsCollection.items;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Or your specific domain for better security
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400', // Cache für 1 Stunde, stale-while-revalidate für 24 Stunden
      },
      body: JSON.stringify(gigs),
    };
  } catch (error) {
    console.error('Error in get-gigs function:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Fehler nicht cachen
      },
      body: JSON.stringify({ error: 'Internal Server Error', message: error.message }),
    };
  }
};
