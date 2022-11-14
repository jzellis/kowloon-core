import { User, Circle } from "../../models";

const circle = async function (
  search = {
    _id: null,
  }
) {
  let circle = await Circle.findOne(search);
  let user = await User.findOne({ _id: circle.author }, { password: 0 });
  return JSON.parse(JSON.stringify({ circle, user }));
};

const circles = async function (search = {}, limit = 0, offset = 0) {
  return JSON.parse(
    JSON.stringify(await Circle.find(search).limit(limit).skip(offset).exec())
  );
};

const addCircle = async (circle) => {
  let response = {};
  try {
    response.circle = await Circle.create(circle);
  } catch (e) {
    response.error = e;
  }
  return JSON.parse(JSON.stringify(response));
};

const updateCircle = async (circleId, fields) => {
  let response = {};
  try {
    response.circle = await Circle.findByIdAndUpdate(circleId, fields);
  } catch (e) {
    response.error = e;
  }
  return JSON.parse(JSON.stringify(response));
};

export { circle, circles, addCircle, updateCircle };
