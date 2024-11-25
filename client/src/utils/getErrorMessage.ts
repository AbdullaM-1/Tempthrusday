export const getErrorMessage = (message: string | undefined) => {
  return !message ? "Internet server error, try later" : message;
};
