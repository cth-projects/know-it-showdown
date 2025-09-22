

/**
 * Generates a unique room code 
 *  TEMPORARY
 */
export  async function generateUniqueRoomCode(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  
  return result;
  
}

// Simple unique placeholder generator
export function generatePlaceholderUpstashId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

