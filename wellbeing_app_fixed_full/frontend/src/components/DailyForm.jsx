import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function DailyForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    pain_level: 0,
    sleep_quality: 5,
    mood: 5,
    symptoms: "",
    triggers: "",
    diet_meals: "",
    physical_activity: "",
    medications: "",
    additional_notes: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/daily", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaving(false);
      navigate("/history");
    } catch (err) {
      setSaving(false);
      setError("Erro ao salvar. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-16 bg-[#1F1F33] pb-12">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-[#29293E] p-8 rounded-2xl shadow-2xl w-full max-w-2xl"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-[#EAEAFB] mb-3"
        >
          Daily wellbeing log
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-[#A5A5D6] mb-6"
        >
          Quickly record your metrics for today
        </motion.p>

        <motion.form
          onSubmit={submit}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-3 gap-3">
            <label className="text-sm text-[#CFCFE8]">
              Pain (0–10)
              <input
                name="pain_level"
                type="number"
                min="0"
                max="10"
                value={form.pain_level}
                onChange={change}
                className="w-full mt-2 p-2 rounded-lg bg-[#232333] text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
              />
            </label>
            <label className="text-sm text-[#CFCFE8]">
              Sleep (0–10)
              <input
                name="sleep_quality"
                type="number"
                min="0"
                max="10"
                value={form.sleep_quality}
                onChange={change}
                className="w-full mt-2 p-2 rounded-lg bg-[#232333] text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
              />
            </label>
            <label className="text-sm text-[#CFCFE8]">
              Mood (0–10)
              <input
                name="mood"
                type="number"
                min="0"
                max="10"
                value={form.mood}
                onChange={change}
                className="w-full mt-2 p-2 rounded-lg bg-[#232333] text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
              />
            </label>
          </div>

          <div>
            <label className="text-sm text-[#CFCFE8]">Symptoms</label>
            <textarea
              name="symptoms"
              value={form.symptoms}
              onChange={change}
              className="w-full mt-2 p-3 rounded-lg bg-[#232333] text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
              rows="3"
            />
          </div>

          <div>
            <label className="text-sm text-[#CFCFE8]">Triggers</label>
            <input
              name="triggers"
              value={form.triggers}
              onChange={change}
              className="w-full mt-2 p-2 rounded-lg bg-[#232333] text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm text-[#CFCFE8]">Diet / Meals</label>
            <label className="text-sm text-[#CFCFE8]">Physical activity</label>
            <input
              name="diet_meals"
              value={form.diet_meals}
              onChange={change}
              className="w-full mt-2 p-2 rounded-lg bg-[#232333] text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
            />
            <input
              name="physical_activity"
              value={form.physical_activity}
              onChange={change}
              className="w-full mt-2 p-2 rounded-lg bg-[#232333] text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-[#CFCFE8]">Medications</label>
            <input
              name="medications"
              value={form.medications}
              onChange={change}
              className="w-full mt-2 p-2 rounded-lg bg-[#232333] text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-[#CFCFE8]">Additional notes</label>
            <textarea
              name="additional_notes"
              value={form.additional_notes}
              onChange={change}
              className="w-full mt-2 p-3 rounded-lg bg-[#232333] text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
              rows="3"
            />
          </div>

          {error && <div className="text-red-400">{error}</div>}

          <div className="flex gap-3">
            <motion.button
              type="submit"
              disabled={saving}
              whileTap={{ scale: 0.97 }}
              className="bg-[#6666C4] hover:bg-[#5454F0] text-white px-5 py-2 rounded-lg font-semibold transition-all"
            >
              {saving ? "Saving..." : "Save entry"}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => navigate("/history")}
              whileTap={{ scale: 0.97 }}
              className="bg-transparent border border-[#44435A] text-[#EAEAFB] px-4 py-2 rounded-lg hover:bg-[#2D2D45] transition-all"
            >
              View history
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
