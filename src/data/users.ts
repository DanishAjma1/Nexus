import axios from "axios";
import { Entrepreneur } from "../types";
const URL = "http://localhost:5000";

export const getInvestorsFromDb = async () => {
  try {
    const res = await axios.get(URL + "/user/get-investors", {
      withCredentials: true,
    });
    const { users } = res.data;
    return users;
  } catch (err) {
    console.log(err);
  }
};

export const getInvestorById = async (id) => {
  try {
    const res = await axios.get(URL + "/user/get-investors/" + id, {
      withCredentials: true,
    });
    const { user } = res.data;
    return user;
  } catch (err) {
    console.log(err);
  }
};

export const getEnterprenuerFromDb = async () => {
  try {
    const res = await axios.get(URL + "/user/get-enterpreneurs", {
      withCredentials: true,
    });
    const { users } = res.data;
    return users;
  } catch (err) {
    console.log(err);
  }
};

export const getEnterpreneurById = async (id) => {
  try {
    const res = await axios.get(URL + "/user/get-enterpreneurs/" + id, {
      withCredentials: true,
    });
    const { user } = res.data;
    const filteredUser = filterEntrepreneur(user);
    return filteredUser;
  } catch (err) {
    console.log(err);
  }
};

function filterEntrepreneur(obj: Entrepreneur): Entrepreneur {
  const {
    userId,
    name,
    bio,
    role,
    startupName,
    pitchSummary,
    fundingNeeded,
    industry,
    teamSize,
    location,
    foundedYear,
    email,
    avatarUrl,
  } = obj;
  return {
    userId,
    name,
    bio,
    role,
    foundedYear,
    email,
    startupName,
    pitchSummary,
    fundingNeeded,
    industry,
    teamSize,
    location,
    avatarUrl,
  };
}
