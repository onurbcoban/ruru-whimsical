async function test6() {
  const code = 'DF22g6rN_e6';
  const url = `https://www.instagram.com/p/${code}/`;

  // Test various open resolvers
  const endpoints = [
    `https://www.instagram.com/graphql/query/?query_hash=b3055c01b4b222b8a47dc12b090e4e0d&variables=${encodeURIComponent(JSON.stringify({ shortcode: code }))}`,
    `https://www.instagram.com/p/${code}/?__a=1&__d=dis`,
  ];

  for (const ep of endpoints) {
    try {
      console.log('Testing endpoint:', ep.slice(0, 80));
      const res = await fetch(ep, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
          'Accept': '*/*',
          'X-IG-App-ID': '936619743392459', // Official Instagram Web App ID
        }
      });
      console.log('Status:', res.status);
      if (res.ok) {
        const json = await res.json();
        console.log('JSON keys:', Object.keys(json));
        const media = json.graphql?.shortcode_media || json.items?.[0] || json.data?.shortcode_media;
        if (media) {
          const displayUrl = media.display_url || media.image_versions2?.candidates?.[0]?.url;
          console.log('SUCCESS! Real Instagram Image URL:', displayUrl?.slice(0, 100));
        }
      }
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}
test6();
