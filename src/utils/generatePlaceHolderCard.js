export const generatePlaceHolder = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    title: "",
    description: "",
    members: [],
    owner: column._id,
    isPlaceHolder: true,
  };
};
