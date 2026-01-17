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

export const createInvestorProfile = async (formData: any) => {
  try {
    await axios.put(
      `${URL}/investor/update-profile/${formData.userId}`,
      formData,
      {
        withCredentials: true,
      }
    );

    toast.success("🎉 Investor profile created successfully! Your account is under review.");
    return true;
  } catch (err: any) {
    console.log(err);
    const errorMessage = err.response?.data?.message || "Failed to create profile.";
    toast.error(`Registration failed: ${errorMessage}`);
    throw err;
  }
};

export const createEnterProfile = async (formData: any) => {
  try {
    await axios.put(
      `${URL}/entrepreneur/update-profile/${formData.userId}`,
      formData,
      {
        withCredentials: true,
      }
    );

    toast.success("🎉 Entrepreneur profile created successfully! Your account is under review.");
    return true;
  } catch (err: any) {
    console.log(err);
    const errorMessage = err.response?.data?.message || "Failed to create profile.";
    toast.error(`Registration failed: ${errorMessage}`);
    throw err;
  }
};
export const sendMailToUser = async (message: string, sub: string, email: string) => {
  try {
    const res = await axios.post(
      `${URL}/auth/send-mail`,
      { email, message, sub },
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) toast.success("Email has been sent successfully.");;
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

export const getSuccessfulEntrepreneurs = () => { };

export const AmountMeasureWithTags = (amount: number) => {
  if (amount !== 0) {
    const val = amount;

    let formattedVal = "";
    formattedVal = Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(val);

    return formattedVal;
  }
  return "0";
};
export const addTeamMember = async (userId: string, formData: FormData) => {
  try {
    const res = await axios.post(
      `${URL}/entrepreneur/add-team-member/${userId}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    toast.success("Team member added successfully");
    return res.data;
  } catch (err) {
    console.error(err);
    toast.error("Failed to add team member");
    throw err;
  }
};

export const updateTeamMember = async (userId: string, memberId: string, formData: FormData) => {
  try {
    const res = await axios.put(
      `${URL}/entrepreneur/update-team-member/${userId}/${memberId}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    toast.success("Team member updated successfully");
    return res.data;
  } catch (err) {
    console.error(err);
    toast.error("Failed to update team member");
    throw err;
  }
};

export const deleteTeamMember = async (userId: string, memberId: string) => {
  try {
    const res = await axios.delete(
      `${URL}/entrepreneur/delete-team-member/${userId}/${memberId}`,
      {
        withCredentials: true,
      }
    );
    toast.success("Team member removed successfully");
    return res.data;
  } catch (err) {
    console.error(err);
    toast.error("Failed to remove team member");
    throw err;
  }
};
