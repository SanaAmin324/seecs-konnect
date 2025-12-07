import { useNavigate } from "react-router-dom";

export default function DocumentProgressBar({ currentStep }) {
  const navigate = useNavigate();

  const steps = [
    { label: "Upload", path: "/documents/upload" },
    { label: "Info", path: "/documents/info" },
    { label: "Category", path: "/documents/category" },
    { label: "Review", path: "/documents/review" },
  ];

  return (
    <div className="flex justify-between max-w-xl mx-auto mb-6">
      {steps.map((step, index) => {
        const completed = index + 1 < currentStep;
        const active = index + 1 === currentStep;

        return (
          <div
            key={index}
            className={`flex-1 text-center cursor-pointer ${
              active ? "font-bold text-blue-600" : completed ? "text-gray-500" : "text-gray-300"
            }`}
            onClick={() => {
              // Only allow clicking completed or active steps
              if (completed || active) navigate(step.path);
            }}
          >
            <div className="w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center border-2 border-gray-300">
              {index + 1}
            </div>
            <span>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
