export async function getUsage(uid) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/usage`, {
    headers: { 'X-User-Id': uid },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch usage info');
  }

  return response.json();
}
