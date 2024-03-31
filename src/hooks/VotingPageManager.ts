import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import useContestant from "./useContestant";
import useContestantVoting from "./useContestantVoting";
import CategoriesProvider from "./CategoriesProvider";

export interface Contestant {
  _id: string;
  name: string;
  categories: string[];
}

const useVoting = () => {
  const [projectId, setProjectId] = useState<string>(""); 
  const [closedMessage, setClosedMessage] = useState<string>(""); 
  const [loading, setLoading] = useState(false);
 
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

  const { currentVoted, display, setDisplay, vote } = useContestantVoting(
    selectedCategories,
    contestants,
    currentSelected, 
    projectId
  );

  //load data
  useEffect(() => {
    if (projectId) {
      setLoading(true)
      apiClient
        .get(`/contestant/${projectId}`)
        .then((response) => {
          setContestant(response.data.results);
          setCategories(response.data.project.categories);
          setLoading(false)
        })
        .catch((error) => {
      
          switch (error?.response?.status) {
            case 429:
              setDisplay("spam");
              break;
          
            case 403:
              setDisplay("closed")
              setClosedMessage(error.response.data)
              break;
          }
          setLoading(false)
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
    closedMessage,
    changeSelectedContestantPerCategorie,
    currentVoted,
    loading
  };
};

export default useVoting;
