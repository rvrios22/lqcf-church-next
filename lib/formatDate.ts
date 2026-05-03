export const formatDate = (unix: number) => {
  return new Date(unix).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};