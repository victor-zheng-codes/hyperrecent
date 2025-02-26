export type Topic = {
  value: number;
  label: string;
};

export async function getTopics(): Promise<Topic[]> {
  try {
    const request = new Request(`${process.env.frontendUrl}/api/topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'limit': 25
      })
    });

    const response = await fetch(request);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data structure to match our Topic type
    return data.topics.map((topic: { name: string; topicId: number }) => ({
      label: topic.name,
      value: topic.topicId
    }));

  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
}