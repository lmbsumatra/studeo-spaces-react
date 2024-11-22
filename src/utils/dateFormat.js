export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateString);  // Log the invalid date string
    return "Invalid Date";  // Return a default string for invalid dates
  }
  
  // Check if the date is a valid week format, i.e., "YYYY-Www"
  const weekFormatRegex = /^\d{4}-W\d{2}$/;
  if (weekFormatRegex.test(dateString)) {
    // Extract year and week from the format "YYYY-Www"
    const [year, week] = dateString.split('-W');
    
    // Return the date in "Year-Wweek" format, e.g., "2024-W47"
    return `${year}-W${week}`;
  }
  
  // Format the valid date into a more readable format
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
  // Try to return the formatted date
  try {
    return date.toLocaleDateString(undefined, options); // Format date to "Month Day, Year"
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid Date";  // Fallback if the formatting fails
  }
};
