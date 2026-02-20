import ogs from 'open-graph-scraper';

export interface MetadataResult {
  title: string;
  description: string;
  image: string;
  domain: string;
}

export async function fetchMetadata(url: string): Promise<MetadataResult> {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.replace('www.', '');

    const options = { url, timeout: 10000 };
    const { result } = await ogs(options);

    let image = '';
    if (result.ogImage && result.ogImage.length > 0) {
      image = result.ogImage[0].url;
      
      if (image.startsWith('/')) {
        image = `${parsedUrl.protocol}//${parsedUrl.host}${image}`;
      }
    }

    return {
      title: result.ogTitle || result.twitterTitle || domain,
      description: result.ogDescription || result.twitterDescription || '',
      image,
      domain,
    };
  } catch (error) {
    console.error(`Error fetching metadata for ${url}:`, error);
    
    try {
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname.replace('www.', '');
      return {
        title: domain,
        description: '',
        image: '',
        domain,
      };
    } catch {
      throw new Error('Invalid URL');
    }
  }
}
