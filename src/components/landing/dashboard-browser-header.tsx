export const DashboardBrowserHeader = () => {
  return (
    <div className="bg-linear-to-b from-neutral-100 to-neutral-50 px-4 py-3 flex items-center gap-2 border-b border-neutral-200">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
        <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
      </div>
      <div className="flex-1 flex justify-center">
        <div className="bg-white border border-neutral-200 rounded-lg px-4 py-1.5 text-sm text-neutral-600 flex items-center gap-2 shadow-sm">
          <svg
            className="w-3.5 h-3.5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          app.linkai.co.il
        </div>
      </div>
    </div>
  );
};
