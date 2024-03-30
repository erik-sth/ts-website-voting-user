import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import apiClient from "../../services/api-client";
import { LocalStorageManager } from "./LocalStorageManager";
import { arraysHaveSameValues } from "../../utils/array";

export interface Contestant {
  _id: string;
  name: string;
  categories: string[];
}

const useContestVoting = (
  selectedCategories: string[],
  contestants: Contestant[],
  currentSelected: Contestant | undefined
  ,projectId: string
) => {

  const manageLocalStorage = useMemo(
    () => new LocalStorageManager(projectId as string),
    [projectId]
  );

  const [storeVotedPerCategory, setStoreVotedPerCategorie] = useState<
    { categories: string[]; contestant: Contestant }[]
  >([]);
  const [currentVoted, setCurrentVoted] = useState<Contestant>();
  const [display, setDisplay] = useState<
    "voting" | "banned" | "voted" | "spam"
  >("voting");
  const saveStoredContestantWhenVoted = useCallback(
    (contestantStored: Contestant) => {
      setStoreVotedPerCategorie((prevStore) => [
        ...prevStore.filter((s) =>
          arraysHaveSameValues(selectedCategories, s.categories)
        ),
        { categories: selectedCategories, contestant: contestantStored },
      ]);
    },
    [selectedCategories]
  );
  //find contestant if already voted for displaying contestant
  useEffect(() => {
    // Check if already stored
    const voted = storeVotedPerCategory.find((s) =>
      arraysHaveSameValues(s.categories, selectedCategories)
    );

    if (voted) {
      setCurrentVoted(voted?.contestant);
      if (display === "banned") {
        setTimeout(() => {
          setDisplay("voted");
        }, 1000);
      } else {
        setDisplay("voted");
      }
      return;
    }

    // If not stored then check local storage
    const name = manageLocalStorage.getVoted(selectedCategories);
    if (display == "spam") return;
    if (!name) {
      setCurrentVoted(undefined);
      setDisplay("voting"); // Ensure to set display to "voting" here
      return;
    }

    // If name found, check for the contestant
    const contestantStored = contestants.find((r) => r.name === name);
    setCurrentVoted(contestantStored);

    if (contestantStored) saveStoredContestantWhenVoted(contestantStored);

    setDisplay("voting");
  }, [
    contestants,
    display,
    manageLocalStorage,
    saveStoredContestantWhenVoted,
    selectedCategories,
    storeVotedPerCategory,
  ]);
  function vote() {
    if (!currentSelected)
      throw Error("Voting button enabled before selecting contestant.");
    apiClient
      .post(`/vote/${projectId}/${currentSelected?._id}`)
      .then(() => {
        manageLocalStorage.setVoted(
          currentSelected?.name || "",
          selectedCategories
        );

        saveStoredContestantWhenVoted(currentSelected);
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 403) {
          manageLocalStorage.setVoted(
            currentSelected?.name || "",
            selectedCategories
          );

          saveStoredContestantWhenVoted(currentSelected);
          setDisplay("banned");
        } else if (err.response?.status === 429) {
          setDisplay("spam");
        }
      });
  }

  return {
    vote,
    display,
    setDisplay,
    currentVoted,
  };
};

export default useContestVoting;
