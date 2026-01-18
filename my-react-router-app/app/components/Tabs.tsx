import { Link } from "react-router";

interface TabsProps {
  activeTab: "incomplete" | "complete";
}

export function Tabs({ activeTab }: TabsProps) {
  const tabs = [
    { id: "incomplete", label: "未完了", searchParam: "incomplete" },
    { id: "complete", label: "完了", searchParam: "complete" },
  ] as const;

  return (
    <div className="border-b border-gray-200 mb-4">
      <nav className="flex -mb-px" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              to={`/?tab=${tab.searchParam}`}
              className={`
                py-2 px-4 text-sm font-medium border-b-2 transition-colors
                ${
                  isActive
                    ? "border-[#2920af] text-[#2920af]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
