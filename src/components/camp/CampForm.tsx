import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const URL = import.meta.env.VITE_BACKEND_URL;


interface CampFormProps {
  onSuccess: () => void;
}

const CampForm: React.FC<CampFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    startDate: "",
    endDate: "",
    category: "Other",
  });

  const [images, setImages] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
      setPreviewUrls(Array.from(e.target.files).map((file) => URL.createObjectURL(file)));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
  const { title, description, goalAmount, startDate, endDate, category } = formData;

  // Title validations
  if (!title.trim()) {
    toast.error("Title is required");
    return false;
  }

  // Only letters and spaces allowed for title
  if (!/^[A-Za-z\s]+$/.test(title)) {
    toast.error("Title must contain only letters and spaces");
    return false;
  }

  // Description validations
  if (!description.trim()) {
    toast.error("Description is required");
    return false;
  }

  // Only letters and spaces allowed for description
  if (!/^[A-Za-z\s]+$/.test(description)) {
    toast.error("Description must contain only letters and spaces");
    return false;
  }

  // Description lenght validation
  const wordCount = description.trim().split(/\s+/).length;
  if (wordCount < 30) {
    toast.error("Description must be at least 30 words");
    return false;
  }

  // Goal amount validation
  if (!goalAmount || isNaN(Number(goalAmount)) || Number(goalAmount) <= 0) {
    toast.error("Goal amount must be a positive number");
    return false;
  }

  // Date validations
  if (!startDate) {
    toast.error("Start date is required");
    return false;
  }

  if (!endDate) {
    toast.error("End date is required");
    return false;
  }

  if (new Date(startDate) > new Date(endDate)) {
    toast.error("Start date cannot be after end date");
    return false;
  }

  // Category validation
  if (!category) {
    toast.error("Category is required");
    return false;
  }

  // Images validation
  if (!images || images.length === 0) {
    toast.error("At least one image is required");
    return false;
  }
  return true;
};



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      if (images) {
        for (let i = 0; i < images.length; i++) {
          data.append("images", images[i]);
        }
      }

      await axios.post(`${URL}/admin/campaigns`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("🎉 Campaign created successfully!");
      setFormData({
        title: "",
        description: "",
        goalAmount: "",
        startDate: "",
        endDate: "",
        category: "Other",
      });
      setImages(null);
      setPreviewUrls([]);
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create campaign"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-lg mx-auto p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-black via-gray-900 to-gray-800 border border-yellow-600/40 space-y-5 text-white"
    >
      <motion.h2
  className="text-2xl font-bold text-center text-yellow-400 mt-2"
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.4 }}
>
  🚀 Add New Campaign
</motion.h2>

      {/* Title */}
      <motion.input
        whileFocus={{ scale: 1.02 }}
        type="text"
        name="title"
        placeholder="Campaign Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
        className="w-full bg-gray-900 text-white border border-yellow-700 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
      />

      {/* Description */}
      <motion.textarea
        whileFocus={{ scale: 1.02 }}
        name="description"
        placeholder="Campaign Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
        rows={4}
        className="w-full bg-gray-900 text-white border border-yellow-700 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
      />

      {/* Goal Amount */}
      <motion.input
        whileFocus={{ scale: 1.02 }}
        type="number"
        name="goalAmount"
        placeholder="Goal Amount"
        value={formData.goalAmount}
        onChange={handleChange}
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
        className="w-full bg-gray-900 text-white border border-yellow-700 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
      />

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
          className="w-full bg-gray-900 text-white border border-yellow-700 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
        />
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
          className="w-full bg-gray-900 text-white border border-yellow-700 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
        />
      </div>

      {/* Category */}
      <motion.select
        whileFocus={{ scale: 1.02 }}
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full bg-gray-900 text-white border border-yellow-700 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
      >
        <option>Technology</option>
        <option>Health</option>
        <option>Education</option>
        <option>Environment</option>
        <option>Other</option>
      </motion.select>

      {/* File Upload */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="border-2 border-dashed border-yellow-700 p-4 rounded-lg text-center hover:border-yellow-400 transition"
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-gray-300"
        />
      </motion.div>

      {/* Preview Images */}
      {previewUrls.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mt-2">
          {previewUrls.map((url, idx) => (
            <motion.img
              key={idx}
              src={url}
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg border border-yellow-700 shadow-sm"
              whileHover={{ scale: 1.05 }}
            />
          ))}
        </div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-black py-3 rounded-lg font-semibold shadow-lg hover:from-yellow-400 hover:to-yellow-600 transition "
      >
        {loading ? "⏳ Creating..." : "Create Campaign"}
      </motion.button>
    </motion.form>
  );
};

export default CampForm;
