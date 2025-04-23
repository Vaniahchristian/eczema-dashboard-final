import React from "react";

export default function PatientInfoCard({ patient }: { patient: any }) {
  if (!patient) return null;
  return (
    <div className="flex items-center space-x-4">
      {patient.patientImage ? (
        <img
          src={patient.patientImage}
          alt={patient.patientName}
          className="w-12 h-12 rounded-full border"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
          <span className="text-sky-600 font-medium text-xl">
            {patient.patientName?.charAt(0)}
          </span>
        </div>
      )}
      <div>
        <div className="font-semibold text-gray-800 dark:text-white">
          {patient.patientName}
        </div>
        {/* Add more patient info fields here as needed */}
        <div className="text-xs text-gray-500">Patient ID: {patient.id}</div>
      </div>
    </div>
  );
}
