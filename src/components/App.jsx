import { Route, Routes, Link, useLocation, matchPath } from "react-router-dom";
import { useEffect, useState } from "react";
import callToApi from "../services/api";
import ls from "../services/localStorage";
import "../scss/App.scss";
import CharactersList from "./CharactersList";
import Filters from "./Filters";
import CharacterDetail from "./CharacterDetail";
import PageNotFound from "./PageNotFound";
import CharacterNotFound from "./CharacterNotFound";
import Header from "./Header";

function App() {
  const [charactersData, setCharactersData] = useState([]);
  const [nameInput, setNameInput] = useState(ls.get("Name searched", ""));
  const [statusInput, setStatusInput] = useState(ls.get("Status searched", ""));
  const [speciesInput, setSpeciesInput] = useState(
    ls.get("Species searched", "")
  );

  useEffect(() => {
    callToApi().then((response) => {
      setCharactersData(response);
    });
  }, []);

  useEffect(() => {
    ls.set("Name searched", nameInput);
  }, [nameInput]);

  useEffect(() => {
    ls.set("Status searched", statusInput);
  }, [statusInput]);

  useEffect(() => {
    ls.set("Species searched", speciesInput);
  }, [speciesInput]);

  const handleNameChange = (value) => {
    setNameInput(value);
  };

  const handleStatusChange = (value) => {
    setStatusInput(value);
  };

  const handleSpeciesChange = (value) => {
    setSpeciesInput(value);
  };

  const handleResetButton = () => {
    setNameInput("");
    setStatusInput("");
    setSpeciesInput("");
  };

  const filteredCharacters = charactersData
    .filter((character) => {
      return character.name.toLowerCase().includes(nameInput.toLowerCase());
    })
    .filter((character) => {
      return statusInput === "" ? true : character.status === statusInput;
    })
    .filter((character) => {
      return speciesInput === "" ? true : character.species === speciesInput;
    });

  const { pathname } = useLocation();
  const routeData = matchPath("/detail/:id", pathname);
  let idCharacterRoute = undefined;
  if (routeData !== null) {
    idCharacterRoute = routeData.params.id;
  }
  const characterSelected = filteredCharacters.find((character) => {
    return character.id === parseInt(idCharacterRoute);
  });

  return (
    <>
      <Header />
      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Filters
                  name={nameInput}
                  handleNameChange={handleNameChange}
                  status={statusInput}
                  handleStatusChange={handleStatusChange}
                  species={speciesInput}
                  handleSpeciesChange={handleSpeciesChange}
                  handleResetButton={handleResetButton}
                />
                {filteredCharacters.length === 0 ? (
                  <CharacterNotFound nameInput={nameInput} />
                ) : (
                  <CharactersList characters={filteredCharacters} />
                )}
              </>
            }
          />
          <Route
            path="/detail/:id"
            element={
              characterSelected === undefined ? (
                <PageNotFound />
              ) : (
                <CharacterDetail character={characterSelected} />
              )
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
