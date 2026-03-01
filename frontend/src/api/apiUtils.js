export async function request(url, options, fallbackMessage) {
    const response = await fetch(url, options);

    if (!response.ok) {
        let message = fallbackMessage
        try {
            const errorData = await response.json()
            if (errorData?.message) {
                message = errorData.message
            }
        } catch {
            // Keep fallback message when backend response is not JSON.
        }
        throw new Error(message)
    }

    return response.json();
}