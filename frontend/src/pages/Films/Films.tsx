import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import type { IFilm } from "../../interface/api.types";
import { GenericStatsDashboard } from "../../components/GenericStatsDashboard/GenericStatsDashboard";

interface ApiResponse {
  data: IFilm[];
  total: number;
}

export const FilmsPage = () => {
  const [films, setFilms] = useState<IFilm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [expandedFilmId, setExpandedFilmId] = useState<number | null>(null);

  const ITEMS_PER_PAGE = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchFilms = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<ApiResponse>(`/film?page=${currentPage}`, {
          signal: controller.signal
        });
        setFilms(response.data.data);
        setTotalRecords(response.data.total);
        setIsLoading(false);
      } catch (err) {
        console.log("An error occurred while loading data from the server.");
      }
    };

    fetchFilms();
    return () => controller.abort();
  }, [currentPage]);

  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  const toggleExpandStats = (id: number) => {
    setExpandedFilmId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-gradient-to-b from-blue-600/10 to-transparent blur-[150px] pointer-events-none z-0"></div>

      <div className="w-full max-w-6xl z-10 flex flex-col h-full flex-grow">
        <div className="w-full max-w-6xl z-10 mb-4 self-start">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-blue-400 transition-colors group font-mono"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase font-sans">
              Films Catalogue
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-sans">Manage database records and view movie analytics</p>
          </div>
          <button className="px-5 py-2.5 bg-blue-950/40 border border-blue-500/50 rounded-xl font-bold font-sans uppercase tracking-widest text-xs text-blue-400 hover:bg-blue-500 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-300 active:scale-95">
            + Create New Film
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold tracking-widest uppercase text-center">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-slate-800 rounded-2xl">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-xs text-blue-400 tracking-widest uppercase animate-pulse">Loading dataset...</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md shadow-2xl">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 font-sans text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6 font-semibold w-16">ID</th>
                  <th className="py-4 px-6 font-semibold">Title</th>
                  <th className="py-4 px-6 font-semibold">Director</th>
                  <th className="py-4 px-6 font-semibold">Producers</th>
                  <th className="py-4 px-6 font-semibold text-center">Statistics</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {films.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500 text-xs uppercase tracking-wider">
                      No records found in this category.
                    </td>
                  </tr>
                ) : (
                  films.map((film) => {
                    const isExpanded = expandedFilmId === film.id;

                    return (
                      <React.Fragment key={film.id}>
                        <tr className={`hover:bg-slate-800/20 transition-colors duration-150 group ${isExpanded ? "bg-slate-900/40" : ""}`}>
                          <td className="py-4 px-6 text-slate-500 font-bold">#{film.id}</td>
                          <td className="py-4 px-6 font-bold font-sans text-slate-200 group-hover:text-blue-400 transition-colors">{film.title}</td>
                          <td className="py-4 px-6 text-slate-300 font-sans">{film.director}</td>
                          <td className="py-4 px-6 text-slate-400 text-xs max-w-[200px] truncate" title={film.producer}>{film.producer}</td>

                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => toggleExpandStats(film.id)}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isExpanded
                                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                                : "bg-slate-800/40 border-slate-700 hover:border-slate-500 text-slate-300 hover:bg-slate-800"
                                }`}
                            >
                              <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isExpanded ? "bg-cyan-400" : "bg-blue-400"}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${isExpanded ? "bg-cyan-400" : "bg-blue-500"}`}></span>
                              </span>
                              {isExpanded ? "Hide Stats" : "View Stats"}
                            </button>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="px-3 py-1.5 bg-slate-800/50 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500/50 rounded-lg text-xs font-sans text-slate-300 hover:text-amber-400 transition-all duration-200">Edit</button>
                              <button className="px-3 py-1.5 bg-slate-800/50 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/50 rounded-lg text-xs font-sans text-slate-300 hover:text-rose-400 transition-all duration-200">Delete</button>
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-slate-950/60 border-l-2 border-l-cyan-500 animate-fadeIn">
                            <td colSpan={6} className="py-6 px-8">
                              <GenericStatsDashboard
                                items={[
                                  {
                                    label: "Cast & Crew",
                                    value: film.characters?.length || 0,
                                    max: 50,
                                    color: "emerald",
                                    icon: (
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                      </svg>
                                    )
                                  },
                                  {
                                    label: "Locations",
                                    value: film.planets?.length || 0,
                                    max: 15,
                                    color: "purple",
                                    icon: (
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
                                      </svg>
                                    )
                                  },
                                  {
                                    label: "Transport Units",
                                    value: film.starships?.length || 0,
                                    max: 20,
                                    color: "amber",
                                    icon: (
                                      <svg className="w-4 h-4 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                      </svg>
                                    )
                                  },
                                  {
                                    label: "Ground Equipment",
                                    value: film.vehicles?.length || 0,
                                    max: 20,
                                    color: "cyan",
                                    icon: (
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                      </svg>
                                    )
                                  },
                                  {
                                    label: "Extra Types",
                                    value: film.species?.length || 0,
                                    max: 25,
                                    color: "rose",
                                    icon: (
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                      </svg>
                                    )
                                  }
                                ]}
                              />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 font-sans text-xs text-slate-400">
          <span>Showing <strong className="text-slate-200">{films.length}</strong> of <strong className="text-slate-200">{totalRecords}</strong> records</span>
          <div className="flex items-center gap-1">
            <button disabled={currentPage === 1 || isLoading} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 border border-slate-800 rounded-lg bg-slate-900/60 hover:border-blue-500/50 text-slate-300 disabled:opacity-30 disabled:hover:border-slate-800 transition-all">Prev</button>
            {[...Array(totalPages || 1)].map((_, index) => (
              <button key={index + 1} disabled={isLoading} onClick={() => setCurrentPage(index + 1)} className={`w-8 h-8 rounded-lg border font-bold transition-all ${currentPage === index + 1 ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]" : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-600"}`}>{index + 1}</button>
            ))}
            <button disabled={currentPage === totalPages || totalPages <= 1 || isLoading} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 border border-slate-800 rounded-lg bg-slate-900/60 hover:border-blue-500/50 text-slate-300 disabled:opacity-30 disabled:hover:border-slate-800 transition-all">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
};