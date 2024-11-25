export const formatTimeTo12Hour = (time) => {
  // Check if time is valid and in 'HH:mm' format
  if (!time || typeof time !== 'string' || !time.includes(":")) {
    console.error("Invalid time format:", time);
    return "Invalid time";  // Return a default value in case of invalid input
  }

  let [hours, minutes] = time.split(":");

  // Ensure hours and minutes are numbers
  hours = parseInt(hours, 10);
  if (isNaN(hours) || isNaN(minutes)) {
    console.error("Invalid time format:", time);
    return "Invalid time";  // Return a default value if parsing fails
  }

  // Determine AM or PM
  const period = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format, handling the edge case of 12 AM/PM
  hours = hours % 12 || 12;  // Convert hours to 12-hour format, handle 12 AM/PM

  // Return formatted time
  return `${hours}:${minutes} ${period}`;
};
