import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-mono selection:bg-yellow-400 selection:text-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/10 via-transparent to-purple-600/10 blur-[120px] rounded-full"></div>

        <div className="absolute inset-0 animate-pulse [animation-duration:3s]">
          <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full shadow-[0_0_4px_#fff]"></div>
          <div className="absolute top-1/4 right-20 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_6px_#93c5fd]"></div>
          <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-1/3 w-1.5 h-1.5 bg-amber-200 rounded-full"></div>
          <div className="absolute top-1/2 left-12 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-20 right-1/4 w-1 h-1 bg-blue-200 rounded-full"></div>
        </div>

        <div className="absolute inset-0 animate-pulse [animation-duration:3s] [animation-delay:1500ms]">
          <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_#fff]"></div>
          <div className="absolute top-12 right-12 w-1 h-1 bg-amber-100 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-1 h-1 bg-blue-300 rounded-full"></div>
          <div className="absolute bottom-1/4 right-10 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_#fff]"></div>
          <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-1/2 right-12 w-1 h-1 bg-purple-200 rounded-full"></div>
        </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 uppercase drop-shadow-[0_2px_10px_rgba(234,179,8,0.2)] font-sans text-center">
        Star Wars Panel
      </h1>

      <p className="text-sm text-slate-400 max-w-xl mx-auto font-sans tracking-wide leading-relaxed text-center mt-4">
        The galaxy is at your fingertips. Select a databank sector below to unlock decrypted records of characters, starships, and worlds.
      </p>

      <div className="flex items-center justify-center gap-2 my-6 w-full max-w-xl">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-slate-700"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shrink-0 shadow-[0_0_8px_#eab308]"></div>
        <div className="h-[1px] w-full bg-gradient-to-l from-transparent to-slate-700"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 pt-2 z-10">
        {[
          { name: 'Films', color: 'hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:text-blue-400', url: "/films" },
          { name: 'People', color: 'hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:text-green-400', url: "/people" },
          { name: 'Planets', color: 'hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:text-purple-400', url: "/planets" }, // Виправлено роут "/planetd" -> "/planets"
          { name: 'Species', color: 'hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:text-cyan-400', url: "/species" },
          { name: 'Starships', color: 'hover:border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:text-amber-400', url: "/starships" }, // Виправлено роут "/starship" -> "/starships"
          { name: 'Vehicles', color: 'hover:border-rose-500 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:text-rose-400', url: "/vehicles" },
        ].map((category) => (
          <button
            key={category.name}
            onClick={() => navigate(category.url)}
            className={`group relative px-6 py-4 bg-slate-950/60 border border-slate-800 rounded-xl font-bold font-sans uppercase tracking-widest text-xs md:text-sm transition-all duration-300 ease-out active:scale-95 ${category.color}`}
          >
            <span className="absolute top-2 left-2 w-1 h-1 rounded-full bg-slate-700 group-hover:bg-current transition-colors"></span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};