import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const videoPath = path.join('/');
  const r2Url = `https://pub-5018f734e2604654b16c6609e8c82280.r2.dev/${videoPath}`;
  
  try {
    console.log(`[Video API] Fetching: ${videoPath}`);
    
    const fetchHeaders: Record<string, string> = {
      'Accept-Encoding': 'gzip, deflate, br',
    };
    
    // Forward range requests for video seeking
    const rangeHeader = request.headers.get('range');
    if (rangeHeader) {
      fetchHeaders['Range'] = rangeHeader;
      console.log(`[Video API] Range request: ${rangeHeader}`);
    }

    // Support conditional requests for better caching
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch) {
      fetchHeaders['If-None-Match'] = ifNoneMatch;
    }

    const response = await fetch(r2Url, {
      headers: fetchHeaders,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    console.log(`[Video API] R2 Response status: ${response.status}`);
    console.log(`[Video API] R2 Headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      return new NextResponse('Video not found', { status: 404 });
    }

    const responseHeaders: Record<string, string> = {
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
      'Access-Control-Expose-Headers': 'Accept-Ranges, Content-Length, Content-Range, Content-Type',
      'X-Content-Type-Options': 'nosniff',
    };

    // Forward important headers from R2
    const contentLength = response.headers.get('content-length');
    const contentRange = response.headers.get('content-range');
    const lastModified = response.headers.get('last-modified');
    const etag = response.headers.get('etag');
    const contentEncoding = response.headers.get('content-encoding');

    if (contentLength) responseHeaders['Content-Length'] = contentLength;
    if (contentRange) responseHeaders['Content-Range'] = contentRange;
    if (lastModified) responseHeaders['Last-Modified'] = lastModified;
    if (etag) responseHeaders['ETag'] = etag;
    if (contentEncoding) responseHeaders['Content-Encoding'] = contentEncoding;

    console.log(`[Video API] Final headers:`, responseHeaders);

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Video proxy error:', error);
    return new NextResponse('Error fetching video', { status: 500 });
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
    },
  });
}