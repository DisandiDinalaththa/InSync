export const fetchAudio = async (text:string) => {
    const response = await fetch (process.env.EXPO_PUBLIC_MY_ENDPOINT!, {
        method : "POST",
        headers: {"content-Type": "application/json"},
        body   : JSON.stringify({ text }),
    });
    return await response.blob(); 
}