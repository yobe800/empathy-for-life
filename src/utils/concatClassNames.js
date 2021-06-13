const concatClassNames = (...args) => {
  const isStringArg = args.every((arg) => ("string" === typeof arg));

  if (!isStringArg) {
    throw new Error("Input only string type");
  }

  return args.join(" ");

};

export default concatClassNames;
