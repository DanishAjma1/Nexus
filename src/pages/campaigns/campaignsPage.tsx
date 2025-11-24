import React, { useState, useEffect } from "react";

export default function CampaignsPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal: "",
    image: "",
    category: "",
    deadline: "",
    creator: "",
    fundingType: "one-time",
  });

  const [campaigns, setCampaigns] = useState<any[]>([]);

  async function fetchCampaigns() {
    try {
      const res = await fetch("http://localhost:4000/api/campaigns");
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  useEffect(() => {
    fetchCampaigns();
  }, []);

  function change(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      ...form,
      goal: Number(form.goal),
      deadline: form.deadline ? new Date(form.deadline) : null,
    };

    try {
      const res = await fetch("http://localhost:4000/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        return alert("Error saving campaign: " + data.error);
      }

      alert("Campaign Saved!");
      setForm({
        title: "",
        description: "",
        goal: "",
        image: "",
        category: "",
        deadline: "",
        creator: "",
        fundingType: "one-time",
      });

      fetchCampaigns();
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error! Server may be offline.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <form onSubmit={submit} className="space-y-3 p-4 border rounded shadow">
        <h2 className="text-xl font-bold">Create New Campaign</h2>

        <input name="title" value={form.title} onChange={change} placeholder="Title" className="border p-2 w-full" />
        <textarea name="description" value={form.description} onChange={change} placeholder="Description" className="border p-2 w-full" />
        <input type="number" name="goal" value={form.goal} onChange={change} placeholder="Goal Amount" className="border p-2 w-full" />
        <input name="image" value={form.image} onChange={change} placeholder="Image URL" className="border p-2 w-full" />
        <input name="category" value={form.category} onChange={change} placeholder="Category" className="border p-2 w-full" />
        <input type="date" name="deadline" value={form.deadline} onChange={change} className="border p-2 w-full" />
        <input name="creator" value={form.creator} onChange={change} placeholder="Creator" className="border p-2 w-full" />

        <select name="fundingType" value={form.fundingType} onChange={change} className="border p-2 w-full">
          <option value="one-time">One-Time</option>
          <option value="recurring">Recurring</option>
          <option value="milestone">Milestone</option>
          <option value="subscription">Subscription</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">All Campaigns</h2>
        {campaigns.length === 0 && <p>No campaigns yet.</p>}

        {campaigns.map((c) => (
          <div key={c._id} className="border p-4 rounded shadow flex space-x-4">
            {c.image && <img src={c.image} alt={c.title} className="w-24 h-24 object-cover rounded" />}
            <div>
              <h3 className="font-bold">{c.title}</h3>
              <p>{c.description}</p>
              <p>
                <strong>Goal:</strong> ${c.goal} | <strong>Pledged:</strong> ${c.pledged}
              </p>
              <p>
                <strong>Funding Type:</strong> {c.fundingType}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
