export const arraysEqual = (array1, array2, comparer) => {
  if (array1 === array2) {
    return true;
  }
  if (!array1 || !array2 || array1.length !== array2.length) {
    return false;
  }

  for (var i = 0; i < array1.length; i++) {
    if (!comparer(array1[i], array2[i])) {
      return false;
    }
  }

  return true;
};