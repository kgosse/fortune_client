export const ADD_FORTUNE = "@@app/ADD_FORTUNE";
export const ADD_FORTUNE_SUCCESS = "@@app/REQUEST_ADD_FORTUNE_SUCCESS";
export const ADD_FORTUNE_ERROR = "@@app/REQUEST_ADD_FORTUNE_ERROR";

export function addFortune({message, time, user}) {
  return {
    type: ADD_FORTUNE,
    message,
    time,
    user
  };
}

