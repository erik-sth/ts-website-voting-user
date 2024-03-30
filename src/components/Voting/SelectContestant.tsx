import { Contestant } from "../../hooks/voting/useContestant";
import "./SelectContestant.css";

interface Props {
  selectContestant: (contestant: Contestant) => void;
  isSelected: (id: string) => boolean;
  renderData: Contestant[];
}

const SelectContestant = ({
  selectContestant,
  renderData,
  isSelected,
}: Props) => {
  return (
    <section className="section">
      <div>
        <ul className="list">
          {renderData &&
            renderData.map((c) => (
              <li
                key={c._id}
                className={
                  isSelected(c._id) ? "list-item selected" : "list-item"
                }
                onClick={() => selectContestant(c)}
              >
                {c.name}
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default SelectContestant;
