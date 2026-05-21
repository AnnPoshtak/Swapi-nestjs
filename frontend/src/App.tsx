import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { HomePage } from "./pages/Home/Home";
import { FilmsPage } from "./pages/Films/Films";
import { PeoplePage } from "./pages/People/People";

/*
import { AuthPage } from "./pages/Auth/Auth";
import { PlanetsPage } from "./pages/Planets/Planets";
import { SpeciesPage } from "./pages/Species/Species";
import { StarshipPage } from "./pages/Starship/Starship";
import { VehiclesPage } from "./pages/Vehicles/Vehicles";
*/

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/films" element={<FilmsPage />} />
        <Route path="/people" element={<PeoplePage />} />

        {/*
          <Route path="/auth" element={<AuthPage />} />
          
          <Route path="/planets" element={<PlanetsPage />} />
          <Route path="/species" element={<SpeciesPage />} />
          <Route path="/starships" element={<StarshipPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />*/}

        <Route path="*" element={
          <div className="min-h-screen bg-black text-red-500 flex items-center justify-center font-mono uppercase tracking-widest">
            Error 404: Orbit not found. This is not the page you are looking for.
          </div>
        } />
      </Routes >
    </BrowserRouter >
  );
}

export default App;