type FilterFields<T> = {
  [key in keyof T]: string;
};

type Filters<T> = string | FilterFields<T>;

export const filterByString = <T extends object>(
  data: T[],
  filter: Filters<T>,
  fields?: { exclude?: Array<keyof T>; include?: Array<keyof T> },
): T[] => {
  if (!filter || typeof data !== "object") {
    return data;
  }

  if (typeof filter === "string") {
    return data.filter((object) => {
      let objKeys = fields?.include || (Object.keys(object) as (keyof T)[]);
      if (fields?.exclude) {
        objKeys = objKeys.filter((key) => !fields.exclude?.includes(key));
      }

      const filterWords = filter.split(",").map((word) => word.trim());

      return filterWords.some((word) => {
        if (!word) return false;
        return objKeys.some((key) =>
          String(object[key]).toLowerCase().includes(word.toLowerCase()),
        );
      });
    });
  }

  const filterKeys = Object.keys(filter) as (keyof FilterFields<T>)[];

  return data.filter((object) => {
    return filterKeys.some((key) => {
      if (!filter[key]) {
        return true;
      }
      return String(object[key])
        .toLowerCase()
        .includes(String(filter[key]).toLowerCase());
    });
  });
};
