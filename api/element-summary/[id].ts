import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    const { id } = req.query;
    const elementId = Array.isArray(id) ? id[0] : id;

    if (!elementId || !/^\d+$/.test(elementId)) {
        return res.status(400).json({
            error: 'A numeric player "id" query parameter is required.'
        });
    }

    try {
        const response = await fetch(
            `https://fantasy.premierleague.com/api/element-summary/${elementId}/`
        );

        if (!response.ok) {
            return res.status(response.status).json({
                error: `FPL API returned ${response.status} ${response.statusText}`
            });
        }

        const data = await response.json();

        res.setHeader('Cache-Control', 's-maxage=300');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: `Failed to fetch FPL data: ${error}`
        });
    }
}