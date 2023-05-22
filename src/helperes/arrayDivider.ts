export const arrayDivider = (array: any[], divider: number): any[][] => {
  const dividedArray = array.reduce((acc: any[][], curr, i) => {
    if (!(i % divider)) acc.push([]);
    acc[acc.length - 1].push(curr);
    return acc;
  }, []);
  return dividedArray;
};
