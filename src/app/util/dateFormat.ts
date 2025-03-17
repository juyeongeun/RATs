export const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const formatTime = (date: Date) => {
  return date.toISOString().split("T")[1].split(".")[0];
};
