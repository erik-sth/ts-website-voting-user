import { useCallback, useEffect, useState } from 'react';
import apiClient from '../services/api-client';
import CategoriesProvider from './CategoriesProvider';
import axios from 'axios';
import { LocalStorageManager } from './LocalStorageManager';
import useContestant from './useContestant';
import { Categories } from '../types/project';
import { page } from '../types/page';

const VotingPageManager = () => {
	const [projectId, setProjectId] = useState<string | undefined>(undefined);
	const { categories, setCategories, selectedCategories, setNewCategory } =
		CategoriesProvider();
	const {
		currentSelected,
		changeSelectedContestantPerCategory,
		renderData,
		setContestants,
		storeSelectedPerCategory,
	} = useContestant(selectedCategories);
	const [display, setDisplay] = useState<page>('loadingPage');
	const [storeVotedPerCategory, setStoreVotedPerCategory] = useState<
		{ categories: string[]; contestantName: string }[]
	>([]);
	const [closedMessage, setClosedMessage] = useState('');
	const manageLocalStorage = new LocalStorageManager(projectId as string);
	useEffect(() => {
		if (currentSelected?.votedName) {
			setDisplay('votedPage');
		} else {
			setDisplay('votingPage'); // TODO: is needed for rerendering after switching categories, but overwrites inputCodePage
		}
	}, [selectedCategories, renderData]);

	useEffect(() => {
		const id = getProjectId();
		if (!id || id === '') {
			window.location.href = '/6807a350b483c60a0b6364eb';
			// setDisplay('inputCodePage'); TODO: temporary for ball 2025
		} else {
			setProjectId(id);
		}
		const fetchData = async () => {
			if (!projectId) return;
			try {
				const categories = await getCategories(projectId);
				const solution: string[] = [];
				backtrack(0, '', solution, categories);

				solution.forEach((s) => {
					const res = manageLocalStorage.getVoted(s.split(''));
					if (res)
						setStoreVotedPerCategory((prev) => [
							...prev,
							{
								contestantName: res,
								categories: s.split(''),
							},
						]);
				});
				getContestants(projectId);
			} catch (error: unknown) {
				handleErrors(error);
			}
		};
		fetchData();
	}, [projectId]);

	const handleErrors = useCallback((error: unknown) => {
		if (axios.isAxiosError(error)) {
			switch (error?.response?.status) {
				case 429:
					setDisplay('spamPage');
					break;
				case 403:
					setClosedMessage(error.response.data);
					setDisplay('errorLoadingPage');
					break;
				default:
					setDisplay('errorLoadingPage');
			}
		}
	}, []);

	function backtrack(
		index: number,
		categoryString: string,
		solutions: string[],
		categories: Categories[]
	) {
		if (index >= categories.length) {
			// Base case: Reached the end of categories array
			solutions.push(categoryString);
			return;
		}

		// Check if categories[index] is defined before accessing its properties
		if (categories[index]) {
			// Include the current category's option 1 in the combination
			backtrack(
				index + 1,
				categoryString + categories[index].option1.key,
				solutions,
				categories
			);

			// Include the current category's option 2 in the combination
			backtrack(
				index + 1,
				categoryString + categories[index].option2.key,
				solutions,
				categories
			);
		}
	}

	const getProjectId = () => {
		const url = window.location.href;
		const lastSlashIndex = url.lastIndexOf('/');
		const extractedProjectId = url.substring(lastSlashIndex + 1);
		return extractedProjectId || undefined;
	};
	const getCategories = async (projectId: string) => {
		try {
			setDisplay('loadingPage');
			const res = await apiClient.get(`/categories/${projectId}`);

			setCategories(res.data.categories);
			return res.data.categories;
		} catch (error) {
			handleErrors(error);
		}
	};
	const getContestants = (projectId: string) => {
		setDisplay('loadingPage');
		apiClient
			.get(`/contestant/${projectId}`)
			.then((response) => {
				setContestants(response.data.results);
				setDisplay('votingPage');
			})
			.catch(handleErrors);
	};
	function vote() {
		if (!currentSelected)
			throw Error('Voting button enabled before selecting contestant.');
		apiClient
			.post(`/vote/${projectId}/${currentSelected?._id}`)
			.then(() => {
				manageLocalStorage.setVoted(
					currentSelected?.name || '',
					selectedCategories
				);

				setStoreVotedPerCategory([
					...storeVotedPerCategory,
					{
						categories: selectedCategories,
						contestantName: currentSelected.name,
					},
				]);
			})
			.catch(handleErrors);
	}
	return {
		renderData,
		categories,
		display,
		selectedCategories,
		currentSelected,
		storeSelectedPerCategory,
		setNewCategory,
		vote,
		changeSelectedContestantPerCategory,
		closedMessage,
	};
};

export default VotingPageManager;
