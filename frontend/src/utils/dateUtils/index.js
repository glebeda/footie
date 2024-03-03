export const getNextGameTime = () => {
    const today = new Date();
    const nextTuesday = new Date(today);
    nextTuesday.setDate(today.getDate() + ((2 - today.getDay() + 7) % 7 || 7)); // 2 is for Tuesday
    nextTuesday.setHours(21, 0, 0, 0); // Set time to 21:00
    return nextTuesday.toISOString().slice(0, 16); // Returns date and time in YYYY-MM-DDTHH:MM format
  };
  