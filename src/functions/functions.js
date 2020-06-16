import moment from "moment";

export const generateLastComments = (comments, num) => {
  let arr = [];
  for (var i = 1; i < num + 1; i++) {
    let elem = comments[comments.length - i];
    if (elem) arr = [...arr, elem];
  }
  return arr;
};

export const checkIfLiked = (likes, user_id) => {
  let arr = likes.map((m) => m.user_id);
  if (arr.includes(user_id)) {
    return true;
  } else {
    return false;
  }
};

export const lockBody = (value) => {
  const body = document.querySelector("body");
  body.style.overflow = value ? "hidden" : "";
};

export const timeFromNow = (value) => {
  let now = moment();

  let then = moment.utc(value, "YYYY-MM-DD HH:mm:ss");
  let difference = moment.utc(
    moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"))
  );
  if (moment(difference).format("DD") > 3) {
    return `${moment(then).format("MMMM")} ${moment(then).format("DD")}`;
  }
  if (moment(difference).format("DD") > 1) {
    return `${moment(difference).format("D")}d ago`;
  }
  if (moment(difference).format("HH") >= 1) {
    return `${moment(difference).format("H")}h ago`;
  }

  if (moment(difference).format("m") == 0) {
    return `just now`;
  } else {
    return `${moment(difference).format("m")}m ago`;
  }
};

export const findObjectIndex = (items, property, parameter) => {
  var index = -1;
  for (var i = 0; i < items.length; ++i) {
    if (items[i][property] == parameter) {
      return (index = i);
      break;
    }
  }
};

export const findIndexInArray = (items, parameter) => {
  var index = -1;
  for (var i = 0; i < items.length; ++i) {
    if (items[i] == parameter) {
      return (index = i);
      break;
    }
  }
};




export const checkIfFollower = (arr, value) => {
  if(!Array.isArray(arr)) return 
   return  arr.some((vendor) => toString(vendor) === toString(value))
}
export const checkIfUser = (id, user_id) => {
 return id === user_id
}