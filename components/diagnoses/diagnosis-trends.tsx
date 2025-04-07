"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { diagnosisApi, type Diagnosis } from "@/services/api/diagnosis";

export default function DiagnosisTrends() {
  const [activeChart, setActiveChart] = useState<"severity" | "confidence" | "distribution">("severity");
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setError('Please log in to view trends');
      setLoading(false);
      return;
    }
    const fetchDiagnoses = async () => {
      try {
        const response = await diagnosisApi.getAllDiagnoses();
        setDiagnoses(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch diagnoses');
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnoses();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (error || !diagnoses.length) return (
    <div className="flex items-center justify-center h-64 text-red-500">
      {error || 'No diagnoses found'}
    </div>
  );

  const sortedDiagnoses = [...diagnoses].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const severityData = sortedDiagnoses.map((d) => ({
    date: new Date(d.createdAt).toLocaleDateString(),
    severity: d.severity === "Mild" ? 1 : d.severity === "Moderate" ? 2 : 3,
    severityLabel: d.severity,
  }));

  const confidenceData = sortedDiagnoses.map((d) => ({
    date: new Date(d.createdAt).toLocaleDateString(),
    confidence: d.confidenceScore * 100,
  }));

  const bodyPartCounts: Record<string, number> = {};
  diagnoses.forEach((d) => {
    bodyPartCounts[d.bodyPart] = (bodyPartCounts[d.bodyPart] || 0) + 1;
  });
  const bodyPartDistribution = Object.entries(bodyPartCounts).map(([name, value]) => ({ name, value }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trends & Analytics</h2>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => setActiveChart("severity")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeChart === "severity" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" :
              "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            Severity
          </button>
          <button
            onClick={() => setActiveChart("confidence")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeChart === "confidence" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" :
              "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            Confidence
          </button>
          <button
            onClick={() => setActiveChart("distribution")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeChart === "distribution" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" :
              "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            Distribution
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="h-[300px]">
          {activeChart === "severity" && (
            <motion.div
              key="severity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={severityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 3]} ticks={[1, 2, 3]} tickFormatter={(value) => 
                    value === 1 ? 'Mild' : value === 2 ? 'Moderate' : 'Severe'
                  } />
                  <Tooltip
                    formatter={(value) => [value === 1 ? 'Mild' : value === 2 ? 'Moderate' : 'Severe', "Severity"]}
                    contentStyle={{ backgroundColor: "white", borderColor: "#e2e8f0", borderRadius: "0.5rem" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="severity"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 6, strokeWidth: 2, fill: "white", stroke: "#0ea5e9" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {activeChart === "confidence" && (
            <motion.div
              key="confidence"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={confidenceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Confidence"]}
                    contentStyle={{ backgroundColor: "white", borderColor: "#e2e8f0", borderRadius: "0.5rem" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 6, strokeWidth: 2, fill: "white", stroke: "#10b981" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {activeChart === "distribution" && (
            <motion.div
              key="distribution"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bodyPartDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {bodyPartDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <h3 className="font-medium mb-4">Insights & Recommendations</h3>
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-sky-600 dark:text-sky-400">Severity Trend</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {severityData[severityData.length - 1].severity < severityData[0].severity
                ? "Your eczema severity has improved over time. Continue with your current treatment plan."
                : severityData[severityData.length - 1].severity > severityData[0].severity
                  ? "Your eczema severity has worsened over time. Consider consulting with your doctor."
                  : "Your eczema severity has remained stable. Continue monitoring and following your treatment plan."}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-sky-600 dark:text-sky-400">Confidence Analysis</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {confidenceData[confidenceData.length - 1].confidence >= 80
                ? "Recent diagnoses show high confidence in the analysis. Continue providing clear images."
                : confidenceData[confidenceData.length - 1].confidence >= 60
                  ? "Diagnosis confidence is moderate. Try to provide well-lit, clear images."
                  : "Recent diagnoses show lower confidence. Ensure good lighting and clear focus."}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-sky-600 dark:text-sky-400">Distribution Pattern</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {`Most commonly affected area is "${bodyPartDistribution[0]?.name}". Consider discussing specific treatment options for this area.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}