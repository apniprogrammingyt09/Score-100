// Convert Firestore document data to plain JSON object
// This removes Timestamp objects and other non-serializable data
export const toPlainObject = (data) => {
  if (!data) return null;
  
  return JSON.parse(JSON.stringify(data, (key, value) => {
    // Convert Firestore Timestamp to ISO string
    if (value && typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
      return new Date(value.seconds * 1000).toISOString();
    }
    return value;
  }));
};

// Convert array of Firestore documents to plain JSON objects
export const toPlainArray = (dataArray) => {
  if (!dataArray || !Array.isArray(dataArray)) return [];
  return dataArray.map(item => toPlainObject(item));
};
