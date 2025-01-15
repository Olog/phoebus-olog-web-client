export const sortByCreatedDate = (descending) => {
  if (descending) {
    return (a, b) => b.createdDate - a.createdDate;
  } else {
    return (a, b) => a.createdDate - b.createdDate;
  }
};
