const getIndexOfObject = (target, targetKey, arr = []) => {
  if (!target || !targetKey) {
    throw new Error("should input both target and targetKey");
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === null || "object" !== typeof arr[i]) {
      throw new Error("this function only finds an index for object element");
    }

    if (arr[i][targetKey] === target) {
      return i;
    }
  }
};

export default getIndexOfObject;
