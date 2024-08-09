// src/utils/api.ts

const API_HOST = 'https://api.supernotes.app';
const API_CARDS_CREATE = '/v1/cards/simple';

export async function simpleCreateCard(
    apiKey: string,
    cardData: {
        name: string;
        markup: string;
        tags: string[];
    }
): Promise<unknown> {
    console.log('[utils/api] Creating Supernotes card', cardData);
    const response = await fetch(`${API_HOST}${API_CARDS_CREATE}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': apiKey,
        },
        body: JSON.stringify(cardData),
    });

    if (!response.ok) {
        throw new Error(`Failed to create Supernotes card: ${response.statusText}`);
    }

    return await response.json();
}
