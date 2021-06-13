import getClickedDogId from "./getClickedDogId";

const popUpDogProfile = (history, dogs) => {
  return (event) => {
    const modal = history.location;
    const clickedDogId = getClickedDogId(dogs, event);

    if (clickedDogId) {
      history.push(`/dogs/${clickedDogId}`, { modal });
    }
  };

};

export default popUpDogProfile;
