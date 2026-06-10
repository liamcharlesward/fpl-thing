import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    try {
        const response = await fetch(
            'https://fantasy.premierleague.com/api/bootstrap-static/'
        );

        const data = await response.json();

        res.setHeader('Cache-Control', 's-maxage=300');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch FPL data'
        });
    }
}