import { DOG_PROFILE_ENUMS } from "../constants/constants";

const getDogDescriptions = (dogData) => {
  return DOG_PROFILE_ENUMS.map((title) => {
    let description = dogData[title.en];

    if (title.en === "age") {
      description = `${dogData[title.en]}살`;
    } else if (title.en === "weight") {
      description = `${dogData[title.en]}Kg`;
    } else if (title.en === "heart_worm") {
      description = dogData[title.en] ? "양성" : "음성";
    } else if (title.en === "neutering") {
      description = dogData[title.en] ? "완료" : "예정";
    } else if (title.en === "adoption_status") {
      switch(dogData[title.en]) {
        case "progress":
          description = "진행 중";
          break;
        case "completed":
          description = "완료";
          break;
        default:
          description = "준비 중";
      }
    }

    return {
      title: title.ko,
      description,
    };
  });
};

export default getDogDescriptions;
