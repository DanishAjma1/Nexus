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

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Title: only letters and spaces
    if (name === "title" && !/^[A-Za-z\s]*$/.test(value)) return;

    // Description: letters, numbers, and spaces only
    if (name === "description" && !/^[A-Za-z0-9\s]*$/.test(value)) return;

    // Category: only letters and spaces
    if (name === "category" && !/^[A-Za-z\s]*$/.test(value)) return;

    // Goal amount: only numbers
    if (name === "goalAmount" && !/^[0-9]*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
      setPreviewUrls((prev) => [...prev, ...newFiles.map((file) => URL.createObjectURL(file))]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset file input
    }
  };

  const validateForm = () => {
    const { title, description, goalAmount, startDate, endDate, category } = formData;

    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(title)) {
      toast.error("Title must contain only letters");
      return false;
    }

    if (!description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!/^[A-Za-z0-9\s]+$/.test(description)) {
      toast.error("Description can contain only letters, numbers, and spaces");
      return false;
    }

    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount < 30) {
      toast.error("Description must be at least 30 words");
      return false;
    }

    if (!goalAmount || isNaN(Number(goalAmount)) || Number(goalAmount) <= 0) {
      toast.error("Goal amount must be a positive number");
      return false;
    }

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

    if (!category.trim()) {
      toast.error("Category is required");
      return false;
    }

    if (images.length === 0) {
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
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      images.forEach((file) => data.append("images", file));

      await axios.post("http://localhost:5000/admin/campaigns", data);
      toast.success("Campaign created successfully!");

      setFormData({
        title: "",
        description: "",
        goalAmount: "",
        startDate: "",
        endDate: "",
        category: "Other",
      });
      setImages([]);
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
        className="w-full border border-gray-300 p-3 rounded-lg"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border border-gray-300 p-3 rounded-lg"
        rows={4}
        required
      />
      <input
        type="text"
        name="goalAmount"
        placeholder="Goal Amount (numbers only)"
        value={formData.goalAmount}
        onChange={handleChange}
        className="w-full border border-gray-300 p-3 rounded-lg"
        required
      />
      <div className="flex gap-2">
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg"
          required
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          min={formData.startDate || undefined}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg"
          required
        />
      </div>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border border-gray-300 p-3 rounded-lg"
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
        ref={fileInputRef}
        className="w-full border border-gray-300 p-3 rounded-lg"
      />
      {previewUrls.length > 0 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {previewUrls.map((url, i) => (
            <div key={i} className="relative">
              <img src={url} className="w-20 h-20 rounded-lg object-cover border" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-0 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
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