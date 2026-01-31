'use client';

export default function AppLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="text-center">
        {/* Logo animé */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-rose-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
        </div>

        {/* Texte de chargement */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 bg-clip-text text-transparent mb-2">
          PROJECT GLOW
        </h2>
        <p className="text-stone-600 text-sm">Chargement...</p>

        {/* Barre de progression */}
        <div className="mt-6 w-48 mx-auto">
          <div className="h-1 bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-orange-300 animate-[loading_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 75%;
            margin-left: 12.5%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
}

