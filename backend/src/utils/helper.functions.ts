export function checkAuthorization(
  userId: string,
  listOfIds1: any[] | string,
  listOfIds2?: any[],
  listOfIds3?: any[],
  listOfIds4?: any[],
) {
  const isAuthorized =
    (Array.isArray(listOfIds1)
      ? listOfIds1.some((ids1) => ids1 === userId)
      : userId === listOfIds1) ||
    (listOfIds2 && listOfIds2.some((ids2) => ids2.id === userId)) ||
    (listOfIds3 && listOfIds3.some((ids3) => ids3.id === userId)) ||
    (listOfIds4 && listOfIds4.some((ids4) => ids4.id === userId));
  return isAuthorized;
}
