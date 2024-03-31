import { useEffect, useState } from "react";
import { Categories, Project } from "../project.types";

export interface Contestant {
  _id: string;
  name: string;
  categories: string[];
}

const CategoriesProvider = (initializeDefaultValues: boolean = true) => {
  const [categories, setCategories] = useState<Project["categories"]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // startup default values
  useEffect(() => {
    if (initializeDefaultValues)
      setSelectedCategories(categories?.map((c) => c.option1.key) || []);
  }, [categories, initializeDefaultValues]);
  function setNewCategorie(
    newCategorie: string,
    existingCategories: Categories,
    remove?: boolean
  ) {
    function filterOut() {
      return selectedCategories.filter(
        (c) =>
          c !== existingCategories.option1.key &&
          c !== existingCategories.option2.key
      );
    }

    if (remove) setSelectedCategories([...filterOut()]);
    else setSelectedCategories([...filterOut(), newCategorie]);
  }

  return {
    categories,
    selectedCategories,
    setNewCategorie,
    setCategories,
  };
};

export default CategoriesProvider;
