const removeCookie = (cookieKey = "") => {
  const { cookie } = document
  const cookieRemovedSpecificKey = cookie
    .split(";")
    .map((cookieString) => {
      if(cookieString.includes(cookieKey)) {

       return `${cookieKey}=; expires=${new Date(0).toUTCString()};`
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
