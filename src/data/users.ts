import axios from "axios";
import toast from "react-hot-toast";
const URL = import.meta.env.VITE_BACKEND_URL;

export const getInvestorsFromDb = async () => {
  try {
    const res = await axios.get(URL + "/investor/get-investors", {
      withCredentials: true,
    });
    const { investors } = res.data;
    return investors;
  } catch (err) {
    console.log(err);
  }
};

export const getInvestorById = async (id) => {
  try {
    const res = await axios.get(URL + "/investor/get-investor-by-id/" + id, {
      withCredentials: true,
    });
    const { investor } = res.data;
    return investor;
  } catch (err) {
    console.log(err);
  }
};

export const getEnterprenuerFromDb = async () => {
  try {
    const res = await axios.get(URL + "/entrepreneur/get-entrepreneurs", {
      withCredentials: true,
    });
    const { entrepreneurs } = res.data;
    return entrepreneurs;
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

export const updateEntrepreneurData = async (formData: any) => {
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

export const updateInvestorData = async (formData: any) => {
  try {
    await axios.put(
      `${URL}/investor/update-profile/${formData.userId}`,
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

export const getUserFromDb = async (id) => {
  try {
    const res = await axios.get(`${URL}/user/get-user-by-id/${id}`);
    const { user } = res.data;
    return user;
  } catch (err) {
    console.log(err);
  }
};
