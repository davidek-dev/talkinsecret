import fetch from 'node-fetch';

export const handler = async function(_event, _context) {
  const {
    CONTENTFUL_SPACE_ID,
    CONTENTFUL_DELIVERY_TOKEN,
    CONTENTFUL_ENVIRONMENT_ID,
  } = process.env;

  // Check if environment variables are set
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_DELIVERY_TOKEN) {
    console.error('Missing Contentful credentials');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing Contentful credentials' }),
    };
  }

  const env = (CONTENTFUL_ENVIRONMENT_ID && CONTENTFUL_ENVIRONMENT_ID.trim()) || 'master';
  const url = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}/environments/${env}`;

  // Content model: talkinSecretGigs with fields: datum (Date), venueevent (Symbol), city (Symbol), link (Symbol)
  // Filter: only upcoming (datum >= now)
  const query = `
    query GigsQuery($now: DateTime!) {
      talkinSecretGigsCollection(order: datum_ASC, where: { datum_gte: $now }) {
        items {
          datum
          venueevent
          city
          link
        }
      }
    }
  `;

  // Compare against start of today (00:00) to avoid excluding events that have a date without time for today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const variables = { now: todayStart.toISOString() };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONTENTFUL_DELIVERY_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('Contentful GraphQL non-OK response:', response.status, text);
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Failed to fetch data from Contentful', status: response.status, details: text?.slice(0, 2000) }),
      };
    }

    const data = await response.json();

    if (data.errors) {
      console.error('Contentful GraphQL errors:', JSON.stringify(data.errors));
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'GraphQL errors from Contentful', errors: data.errors }),
      };
    }

    const rawItems = data?.data?.talkinSecretGigsCollection?.items ?? [];

    // Map to frontend schema expected by Gigs.astro
    const gigs = rawItems
      .map((it) => ({
        date: it?.datum ?? null,
        venue: it?.venueevent ?? '',
        city: it?.city ?? '',
        ticketsUrl: it?.link ?? '',
      }))
      // Safety filter on server as well: drop past events if any slipped through
      .filter((g) => {
        if (!g.date) return false;
        const now = new Date();
        const d = new Date(g.date);
        return d.getTime() >= now.getTime();
      });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=900, s-maxage=900, stale-while-revalidate=3600', // 15min client/proxy cache
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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      body: JSON.stringify({ error: 'Internal Server Error', message: error.message }),
    };
  }
};
