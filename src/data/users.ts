import axios from "axios";
import { Entrepreneur, Investor } from "../types";
import toast from "react-hot-toast";
const URL = "http://localhost:5000";

export const getInvestorsFromDb = async () => {
  try {
    const res = await axios.get(URL + "/investor/get-investors", {
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
    const res = await axios.get(URL + "/investor/get-investor-by-id/" + id, {
      withCredentials: true,
    });
    const { user } = res.data;
    const filteredUser = filterInvestor(user);
    return filteredUser;
  } catch (err) {
    console.log(err);
  }
};

export const getEnterprenuerFromDb = async () => {
  try {
    const res = await axios.get(URL + "/entrepreneur/get-entrepreneurs", {
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
    const res = await axios.get(
      URL + "/entrepreneur/get-entrepreneur-by-id/" + id,
      {
        withCredentials: true,
      }
    );
    const { entrepreneur } = res.data;
    return entrepreneur;
  } catch (err) {
    console.log(err);
  }
};

export const updateEntrepreneurData = async (formData: Entrepreneur) => {
  try {
    await axios.put(
      `${URL}/entrepreneur/update-profile/${formData.userId}`,
      formData,
      {
        withCredentials: true,
      }
    );
    toast.success("User data updated successfully.");
  } catch (err) {
    console.log(err);
  }
};
function filterInvestor(obj: Investor): Investor {
  const {
    userId,
    name,
    bio,
    role,
    location,
    email,
    avatarUrl,
    investmentInterests,
    investmentStage,
    portfolioCompanies,
    totalInvestments,
    minimumInvestment,
    maximumInvestment,
  } = obj;
  return {
    userId,
    name,
    bio,
    role,
    email,
    location,
    avatarUrl,
    investmentInterests,
    investmentStage,
    portfolioCompanies,
    totalInvestments,
    minimumInvestment,
    maximumInvestment,
  };
}

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
