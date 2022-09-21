//function takes array of names and returns an obj with first letter of name as property, and keys of names starting with that letter

export default (arr: any[]) => {
    return arr.reduce(
      (a, v) => ({
        ...a,
        [v[0]]: arr.filter((i) => i[0] == v[0]),
      }),
      {}
    );
  };
  