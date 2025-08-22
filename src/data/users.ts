import axios from "axios";
const URL = "http://localhost:5000";

export const getInvestorsFromDb = async () => {
  await axios
    .get(URL+"/user/get-investors", {
      withCredentials: true,
    })
    .then((res) => {
      const { users } = res.data;
      return users;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getEnterprenuerFromDb = async () => {
  await axios
    .get(URL+"/user/get-enterpreneurs", {
      withCredentials: true,
    })
    .then((res) => {
      const { users } = res.data;
      return users;
    })
    .catch((err) => {
      console.log(err);
    });
};
