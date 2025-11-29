export const getSeasonRangeFromDate = (today: Date) => {
  const y = today.getFullYear();

  const springStart = new Date(y, 2, 21); // Mar 21
  const springEnd = new Date(y, 5, 20); // Jun 20

  const summerStart = new Date(y, 5, 21); // Jun 21
  const summerEnd = new Date(y, 8, 22); // Sep 22

  const fallStart = new Date(y, 8, 23); // Sep 23
  const fallEnd = new Date(y, 11, 21); // Dec 21

  // Winter spans two years!
  const winterStart = new Date(y - 1, 11, 22); // Dec 22 previous year
  const winterEnd = new Date(y, 2, 20); // Mar 20 current year

  if (today >= springStart && today <= springEnd)
    return { season: "spring", start: springStart, end: springEnd };

  if (today >= summerStart && today <= summerEnd)
    return { season: "summer", start: summerStart, end: summerEnd };

  if (today >= fallStart && today <= fallEnd)
    return { season: "fall", start: fallStart, end: fallEnd };

  // Otherwise → winter
  return { season: "winter", start: winterStart, end: winterEnd };
};
