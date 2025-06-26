export const formatDate = (inputDate: string): string => {
  const date = new Date(inputDate);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};

// Format date with day of week
export const formatDateWithDay = (inputDate: string): string => {
  const date = new Date(inputDate);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};

// Format time in 12-hour format
export const formatTime = (inputDate: string): string => {
  const date = new Date(inputDate);
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Format time taken from seconds to readable format
export const formatTimeTaken = (seconds: number): string => {
  if (!seconds && seconds !== 0) return 'N/A';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes} min ${remainingSeconds} sec`;
  }
  return `${remainingSeconds} sec`;
};
