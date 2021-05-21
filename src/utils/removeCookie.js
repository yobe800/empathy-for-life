const removeCookie = (cookieKey = "") => {
  const { cookie } = document
  const cookieRemovedSpecificKey = cookie
    .split(";")
    .map((cookieString) => {
      if(cookieString.includes(cookieKey)) {
       return `${cookieString}; expires=${new Date().toUTCString()};`
      }

      return cookieString;
    })
    .join(";");

    document.cookie = cookieRemovedSpecificKey;
    const hasRemoved
      = cookie !== cookieRemovedSpecificKey
        && !document.cookie.includes(cookieKey);
    return hasRemoved;
};

export default removeCookie;
