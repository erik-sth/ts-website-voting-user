import { useEffect, useState } from "react";
import { arraysHaveSameValues } from "../utils/array";

export interface Contestant {
  _id: string;
  name: string;
  categories: string[];
}

const useContestant = (selectedCategories: string[]) => {
  const [renderData, setRenderData] = useState<Contestant[]>([]);
  const [contestants, setContestant] = useState<Contestant[]>([]);
  const [selectedContestantPerCategorie, setSelectedContestantPerCategorie] =
    useState<{ categories: string[]; contestant: Contestant }[]>([]);
  const [currentSelected, setCurrentSelected] = useState<Contestant>();

  // find if a current selected exists after chaning categories
  useEffect(() => {
    setCurrentSelected(
      selectedContestantPerCategorie.find((c) =>
        arraysHaveSameValues(c.categories, selectedCategories)
      )?.contestant
    );
  }, [selectedCategories, selectedContestantPerCategorie]);

  // filter render data after categorie change or loading data
  useEffect(() => {
    setRenderData(
      contestants.filter((c) =>
        arraysHaveSameValues(c.categories, selectedCategories)
      )
    );
  }, [selectedCategories, contestants]);

  function changeSelectedContestantPerCategorie(
    newSelectedContesant: Contestant
  ) {
    setSelectedContestantPerCategorie([
      ...selectedContestantPerCategorie.filter(
        (c) => !arraysHaveSameValues(c.categories, selectedCategories)
      ),
      { contestant: newSelectedContesant, categories: selectedCategories },
    ]);
  }

  return {
    renderData,
    currentSelected,
    storeSelectedPerCategorie: selectedContestantPerCategorie,
    setContestant,
    changeSelectedContestantPerCategorie,
    contestants,
  };
};

export default useContestant;
