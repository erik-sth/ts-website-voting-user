import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import useContestant from "./useContestant";
import useContestVoting from "./useContestVoting";
import CategoriesProvider from "./CategoriesProvider";

export interface Contestant {
  _id: string;
  name: string;
  categories: string[];
}

const useVoting = () => {
  const [projectId, setProjectId] = useState<string>(""); // State to store projectId

  useEffect(() => {
    const url = window.location.href;
    const lastSlashIndex = url.lastIndexOf("/");
    const extractedProjectId = url.substring(lastSlashIndex + 1);
    setProjectId(extractedProjectId);
  }, []);

  const { categories, setCategories, selectedCategories, setNewCategorie } =
    CategoriesProvider();

  const {
    renderData,
    storeSelectedPerCategorie,
    currentSelected,
    setContestant,
    contestants,
    changeSelectedContestantPerCategorie,
  } = useContestant(selectedCategories);

  const { currentVoted, display, setDisplay, vote } = useContestVoting(
    selectedCategories,
    contestants,
    currentSelected, 
    projectId
  );

  //load data
  useEffect(() => {
    if (projectId) {
      apiClient
        .get(`/contestant/${projectId}`)
        .then((response) => {
          setContestant(response.data.results);
          setCategories(response.data.project.categories);
        })
        .catch((error) => {
          if (error.response?.status === 429) {
            setDisplay("spam");
          }
          console.error("Error fetching contestants and project:", error);
        });
    }
  }, [projectId, setCategories, setContestant, setDisplay]);

  return {
    renderData,
    categories,
    vote,
    display,
    selectedCategories,
    currentSelected,
    storeSelectedPerCategorie,
    setNewCategorie,
    changeSelectedContestantPerCategorie,
    currentVoted,
  };
};

export default useVoting;
