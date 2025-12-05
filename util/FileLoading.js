

export async function loadJsonFile(filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      console.log(jsonData);
      return jsonData;
    } catch (error) {
      console.error("Error loading JSON file:", error);
    }
}
