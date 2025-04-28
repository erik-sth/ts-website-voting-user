import { useEffect, useState } from 'react';
import { arraysHaveSameValues } from '../utils/array';

export interface Contestant {
	_id: string;
	name: string;
	categories: string[];
	votedName?: string |null
}

const useContestant = (selectedCategories: string[]) => {
	const [renderData, setRenderData] = useState<Contestant[]>([]);
	const [contestants, setContestants] = useState<Contestant[]>([]);
	const [selectedContestantPerCategorie, setSelectedContestantPerCategorie] =
		useState<Contestant[]>([]);
	const [currentSelected, setCurrentSelected] = useState<Contestant>();

	// find if a current selected exists after chaning categories
	useEffect(() => {
		setCurrentSelected(
			selectedContestantPerCategorie.find((c) =>
				arraysHaveSameValues(c.categories, selectedCategories)
			)
		);
	}, [selectedCategories, selectedContestantPerCategorie]);

	// filter render data after categorie change or loading data
	useEffect(() => {
		setRenderData(
			contestants?.filter((c) =>
				arraysHaveSameValues(c.categories, selectedCategories)
			)
		);
	}, [selectedCategories, contestants]);

	function changeSelectedContestantPerCategory(
		newSelectedContesant: Contestant
	) {
		setSelectedContestantPerCategorie([
			...selectedContestantPerCategorie.filter(
				(c) => !arraysHaveSameValues(c.categories, newSelectedContesant.categories)
			),	newSelectedContesant]);

	}

	return {
		renderData,
		currentSelected,
		storeSelectedPerCategory: selectedContestantPerCategorie,
		setContestants,
		changeSelectedContestantPerCategory,
		contestants,
		setCurrentSelected
	};
};

export default useContestant;
