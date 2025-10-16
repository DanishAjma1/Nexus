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
      const urls = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls(urls);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (images) {
        for (let i = 0; i < images.length; i++) {
          data.append("images", images[i]);
        }
      }

      await axios.post("http://localhost:5000/admin/campaigns", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
    } catch (error: any) {
      console.error(error);
toast.error(error.response?.data?.message || error.message || "Failed to create campaign");

    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white shadow-md p-4 rounded-xl"
    >
      <h2 className="text-lg font-semibold">Add New Campaign</h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="number"
        name="goalAmount"
        placeholder="Goal Amount"
        value={formData.goalAmount}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
      <div className="flex gap-2">
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border p-2 rounded"
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
        className="w-full border p-2 rounded"
      />

      {previewUrls.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mt-2">
          {previewUrls.map((url, idx) => (
            <img key={idx} src={url} className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Creating..." : "Add Campaign"}
      </button>
    </form>
  );
};

export default CampForm;
