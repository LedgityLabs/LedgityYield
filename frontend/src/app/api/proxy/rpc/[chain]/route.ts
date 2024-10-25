// frontend/src/app/api/proxy/rpc/[chain]/route.ts
type NextRequest = Request;
type NextResponse = Response;

interface ChainParams {
  params: {
    chain: string;
  };
}

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

// Mapping of chain identifiers to their RPC URLs
const RPC_URLS: Record<string, string> = {
  linea: `https://linea-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  arbitrum: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  // Chain ID mappings for better compatibility
  '59144': `https://linea-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
  '42161': `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
};

// Common headers for CORS
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
} as const;

// Helper function to create consistent responses
const createResponse = (data: any, status: number = 200) => {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: CORS_HEADERS
    }
  );
};

export async function POST(
  request: NextRequest,
  { params }: ChainParams
): Promise<NextResponse> {
  const chain = params.chain.toLowerCase();
  const rpcUrl = RPC_URLS[chain];

  if (!rpcUrl) {
    console.warn(`Unsupported chain requested: ${chain}`);
    return createResponse({ error: 'Unsupported chain' }, 400);
  }

  try {
    const body = await request.json();
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      // Add timeout and retry logic
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`RPC returned status: ${response.status}`);
    }

    const data = await response.json();
    return createResponse(data, response.status);
    
  } catch (error) {
    console.error(`RPC proxy error for ${chain}:`, error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return createResponse({ error: 'RPC request timeout' }, 504);
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return createResponse({ error: 'Network error' }, 503);
      }
    }

    return createResponse({ error: 'Failed to fetch from RPC endpoint' }, 500);
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new Response(
    null,
    {
      status: 204,
      headers: CORS_HEADERS
    }
  );
}