import { useRef } from "react";
import { BsSearch } from "react-icons/bs";
import "./Searchbox.css";

interface Props {
  onSearch: (name: string) => void;
}

const SearchBox = ({ onSearch }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (ref.current) {
          onSearch(ref.current.value);
        }
      }}
    >
      <div className="input-group">
        <BsSearch className="search-icon" />
        <input
          ref={ref}
          placeholder="Suche nach deinem Ballkönig/-in..."
        ></input>
      </div>
    </form>
  );
};

export default SearchBox;
