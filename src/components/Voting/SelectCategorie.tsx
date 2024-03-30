import "./SelectCategorie.css";
import { Categories } from "../../hooks/useProject";
interface Props {
  selectedCategories: string[];
  categorie: Categories;

  setCategorie: (newCategorie: string, existingCategories: Categories) => void;
}

const SelectCategorie = ({
  selectedCategories,
  setCategorie,
  categorie,
}: Props) => {
  function isSelected(key: string): boolean {
    return (
      selectedCategories?.filter(
        (sC) => sC === categorie.option1.key || sC === categorie.option2.key
      )[0] === key
    );
  }
  function setToOption1() {
    setCategorie(categorie.option1.key, categorie);
  }
  function setToOption2() {
    setCategorie(categorie.option2.key, categorie);
  }
  return (
    <section className="categorie-input">
      <div
        className={
          isSelected(categorie.option1.key)
            ? `selectionBtn selectCategorie ${categorie.option1.color}`
            : "selectionBtn"
        }
        onClick={setToOption1}
      >
        {categorie.option1.name}
      </div>
      <div
        className={
          isSelected(categorie.option2.key)
            ? `selectionBtn selectCategorie ${categorie.option2.color}`
            : "selectionBtn "
        }
        onClick={setToOption2}
      >
        {categorie.option2.name}
      </div>
      <span className="selection"></span>
    </section>
  );
};

export default SelectCategorie;
