const steps = ["Upload", "Info", "Category", "Review"];

export default function DocumentProgressBar({ currentStep }) {
  return (
    <div className="flex justify-between mb-6">
      {steps.map((label, index) => (
        <div className="flex flex-col items-center flex-1" key={index}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${index + 1 <= currentStep ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          >
            {index + 1}
          </div>
          <p className="mt-1 text-sm">{label}</p>
        </div>
      ))}
    </div>
  );
}
