"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  // Minimum 30 words validation
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

  // Optional: Validate image types and sizes
  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    if (!file.type.startsWith("image/")) {
      toast.error(`File ${file.name} is not an image`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`File ${file.name} exceeds 5MB`);
      return false;
    }
  }

  return true;
};



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (images) Array.from(images).forEach((file) => data.append("images", file));

      await axios.post("http://localhost:5000/admin/campaigns", data);
      toast.success("Campaign created!");

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
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />

      <input
        type="number"
        name="goalAmount"
        placeholder="Goal Amount"
        value={formData.goalAmount}
        onChange={handleChange}
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
        min={1}
      />

      <div className="flex gap-2">
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      >
        <option>Technology</option>
        <option>Health</option>
        <option>Education</option>
        <option>Environment</option>
        <option>Other</option>
      </select>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />

      {previewUrls.length > 0 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {previewUrls.map((url, i) => (
            <img key={i} src={url} className="w-20 h-20 rounded-lg object-cover border" />
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-6 py-3 rounded-full w-full hover:bg-indigo-700 transition-colors"
      >
        {loading ? "Creating..." : "Submit"}
      </button>
    </form>
  );
};

export default CampForm;
