"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface CampFormProps {
  onSuccess: () => void;
  initialData?: any;
}

const CampForm: React.FC<CampFormProps> = ({ onSuccess, initialData }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    startDate: "",
    endDate: "",
    category: "Other",

    organizer: "",
    isLifetime: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        goalAmount: initialData.goalAmount || "",
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",

        category: initialData.category || "Other",
        organizer: initialData.organizer || "",
        isLifetime: initialData.isLifetime || false,
      });
      if (initialData.images && initialData.images.length > 0) {
        setExistingImages(initialData.images);
        setPreviewUrls(initialData.images.map((img: string) => `${BACKEND_URL}${img}`));
      }
      if (initialData.video) {
        setVideoPreview(`${BACKEND_URL}${initialData.video}`);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
      return;
    }

    // Title: only letters and spaces
    if (name === "title" && !/^[A-Za-z\s]*$/.test(value)) return;

    // Description: letters, numbers, and spaces only
    if (name === "description" && !/^[A-Za-z0-9\s]*$/.test(value)) return;

    // Category: only letters and spaces
    if (name === "category" && !/^[A-Za-z\s]*$/.test(value)) return;

    // Organizer: only letters and spaces
    if (name === "organizer" && !/^[A-Za-z\s]*$/.test(value)) return;

    // Goal amount: only numbers
    if (name === "goalAmount" && !/^[0-9]*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalImages = existingImages.length + images.length + newFiles.length;
      if (totalImages > 3) {
        toast.error("You can upload a maximum of 3 images");
        return;
      }
      setImages((prev) => [...prev, ...newFiles]);
      setPreviewUrls((prev) => [
        ...prev,
        ...newFiles.map((file) => window.URL.createObjectURL(file)),
      ]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideo(file);
      setVideoPreview(window.URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  const removeImage = (index: number) => {
    // If index < existingImages.length, it's an existing image
    if (index < existingImages.length) {
      const newExisting = [...existingImages];
      newExisting.splice(index, 1);
      setExistingImages(newExisting);

      const newPreviews = [...previewUrls];
      newPreviews.splice(index, 1);
      setPreviewUrls(newPreviews);
    } else {
      // It's a new file
      const newIndex = index - existingImages.length;
      setImages((prev) => prev.filter((_, i) => i !== newIndex));

      const newPreviews = [...previewUrls];
      newPreviews.splice(index, 1);
      setPreviewUrls(newPreviews);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset file input
    }
  };

  const validateForm = () => {
    const { title, description, goalAmount, startDate, endDate, category, isLifetime } =
      formData;

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

    if (!formData.organizer.trim()) {
      toast.error("Organizer is required");
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

    if (!isLifetime) {
      if (!endDate) {
        toast.error("End date is required");
        return false;
      }

      if (new Date(startDate) > new Date(endDate)) {
        toast.error("Start date cannot be after end date");
        return false;
      }
    }

    if (!category.trim()) {
      toast.error("Category is required");
      return false;
    }

    const totalImages = existingImages.length + images.length;

    if (totalImages === 0) {
      toast.error("At least one image is required");
      return false;
    }

    if (totalImages > 3) {
      toast.error("Maximum 3 images allowed");
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
      existingImages.forEach((url) => data.append("existingImages", url));

      if (video) {
        data.append("video", video);
      }

      // If we are editing and there was a video but now videoPreview is null and no new video, 
      // it means user removed it.
      if (initialData && initialData.video && !videoPreview && !video) {
        data.append("removeVideo", "true");
      }

      if (initialData) {
        await axios.put(`${BACKEND_URL}/admin/campaigns/${initialData._id}`, data);
        toast.success("Campaign updated successfully!");
      } else {
        await axios.post(`${BACKEND_URL}/admin/campaigns`, data);
        toast.success("Campaign created successfully!");
      }

      setFormData({
        title: "",
        description: "",
        goalAmount: "",
        startDate: "",
        endDate: "",
        category: "Other",
        organizer: "",
      });
      setImages([]);
      setExistingImages([]);
      setPreviewUrls([]);
      setVideo(null);
      setVideoPreview(null);

      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const videoInputRef = useRef<HTMLInputElement>(null);
  const triggerVideoInput = () => {
    videoInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
      {/* Left Column: Form Details */}
      <div className="space-y-5">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Campaign Details</h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
          <input
            name="title"
            placeholder="e.g., Innovative Tech Solution"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Describe your campaign..."
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
            rows={5}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Organizer</label>
          <input
            name="organizer"
            placeholder="e.g., Jane Doe"
            value={formData.organizer}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
          >
            <option>Technology</option>
            <option>Health</option>
            <option>Education</option>
            <option>Environment</option>
            <option>Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Goal Amount ($)</label>
            <input
              type="text"
              name="goalAmount"
              placeholder="5000"
              value={formData.goalAmount}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
          <div className="space-y-2">
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              min={formData.startDate || undefined}
              onChange={handleChange}
              disabled={formData.isLifetime}
              className={`w-full border border-gray-300 bg-gray-50 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${formData.isLifetime ? 'opacity-50 cursor-not-allowed' : ''}`}
              required={!formData.isLifetime}
            />
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="isLifetime"
                checked={formData.isLifetime}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 font-medium">Run for Lifetime</span>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column: Media Uploads */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Media Gallery</h3>

        {/* Images Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Images ({existingImages.length + images.length}/3) <span className="text-xs text-gray-400 font-normal">Min 1 required</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                <img
                  src={url}
                  className="w-full h-full object-cover"
                  alt={`Upload ${i}`}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="bg-white/20 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {(existingImages.length + images.length) < 3 && (
              <button
                type="button"
                onClick={triggerFileInput}
                className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-xl hover:bg-indigo-50 hover:border-indigo-500 transition-all group"
              >
                <span className="text-3xl text-indigo-300 group-hover:text-indigo-500 mb-1">+</span>
                <span className="text-xs font-medium text-indigo-400 group-hover:text-indigo-600">Add Image</span>
              </button>
            )}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            disabled={(existingImages.length + images.length) >= 3}
          />
        </div>

        {/* Video Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Video Presentation <span className="text-xs text-gray-400 font-normal">(Optional)</span></label>

          {!videoPreview ? (
            <div
              onClick={triggerVideoInput}
              className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <span className="text-sm text-gray-500 font-medium">Click to upload video</span>
              <span className="text-xs text-gray-400 mt-1">.mp4, .mov (Max 100MB)</span>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-black">
              <video
                src={videoPreview}
                className="w-full h-48 object-contain"
                controls
              />
              <button
                type="button"
                onClick={removeVideo}
                className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"
              >
                ✕
              </button>
            </div>
          )}
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            ref={videoInputRef}
            className="hidden"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t mt-auto">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-lg font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Launching Campaign...
              </div>
            ) : (initialData ? "💾 Update Campaign" : "🚀 Launch Campaign")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CampForm;
