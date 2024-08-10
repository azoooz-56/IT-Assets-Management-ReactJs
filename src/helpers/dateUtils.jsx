
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; 
};

export const convertToInputDateFormat = (dateString) => {
  if (!dateString) return '';
  const [day,month, year,] = dateString.split('-');
  return `${day}-${month}-${year}`; 
};
