import { Categories } from '../../types/project';
import './SelectCategory.css';
interface Props {
	selectedCategories: string[];
	category: Categories;

	setCategory: (newCategory: string, existingCategories: Categories) => void;
}

const SelectCategory = ({
	selectedCategories,
	setCategory: setCategory,
	category: category,
}: Props) => {
	function isSelected(key: string): boolean {
		return (
			selectedCategories?.filter(
				(sC) =>
					sC === category.option1.key || sC === category.option2.key
			)[0] === key
		);
	}
	function setToOption1() {
		setCategory(category.option1.key, category);
	}
	function setToOption2() {
		setCategory(category.option2.key, category);
	}
	return (
		<section className='category-input'>
			<div
				className={
					isSelected(category.option1.key)
						? `selectionBtn selectCategory ${category.option1.color}`
						: 'selectionBtn'
				}
				onClick={setToOption1}
			>
				{category.option1.name}
			</div>
			<div
				className={
					isSelected(category.option2.key)
						? `selectionBtn selectCategory ${category.option2.color}`
						: 'selectionBtn '
				}
				onClick={setToOption2}
			>
				{category.option2.name}
			</div>
			<span className='selection'></span>
		</section>
	);
};

export default SelectCategory;
