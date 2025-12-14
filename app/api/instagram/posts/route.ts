import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
  try {
    const settings = await storage.getSiteSettings();
    
    if (!settings?.instagramAccessToken) {
      return NextResponse.json([]);
    }

    // Fetch Instagram posts using the access token
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,caption,timestamp,thumbnail_url,like_count,comments_count&limit=4&access_token=${settings.instagramAccessToken}`
    );

    if (!response.ok) {
      console.error('Instagram API error:', response.status, response.statusText);
      return NextResponse.json([]);
    }

    const data = await response.json();
    return NextResponse.json(data.data || []);
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return NextResponse.json([]);
  }
}




