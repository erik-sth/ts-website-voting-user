import SelectCategorie from './components/Voting/SelectCategorie';
import SelectContestant from './components/Voting/SelectContestant';
import './Voting.css';
import SearchBox from './components/SearchBox';
import { useCallback, useEffect, useState } from 'react';
import VotingPageManager from './hooks/VotingPageManager';
import { Contestant } from './types/contestant';

const Voting = () => {
	const [filteredContestant, setFilteredContestant] = useState<Contestant[]>(
		[]
	);
	const {
		display,
		categories,
		renderData,
		selectedCategories,
		currentSelected,
		closedMessage,
		changeSelectedContestantPerCategory,
		setNewCategory,
		vote,
	} = VotingPageManager();
	const filterContestantsByName = useCallback(
		(name: string) => {
			if (name === '') return setFilteredContestant(renderData);
			// Escape special characters in the entered name
			const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

			// Construct the regular expression dynamically
			const regexPattern: RegExp = new RegExp(`${escapedName}\\w*`, 'gi');

			// Use the constructed regular expression to filter contestants
			const filteredContestants = renderData.filter((contestant) => {
				return regexPattern.test(contestant.name);
			});

			setFilteredContestant(filteredContestants);
		},
		[renderData]
	);
	useEffect(() => {
		filterContestantsByName('');
	}, [filterContestantsByName, selectedCategories]);

	return (
		<div className='body container'>
			<nav className='container'>
				<h1>Ballkönig/-in</h1>
				{categories &&
					categories.map((c, i) => (
						<SelectCategorie
							key={i}
							setCategorie={setNewCategory}
							selectedCategories={selectedCategories}
							categorie={c}
						/>
					))}
			</nav>
			{renderData?.length > 25 && (
				<SearchBox onSearch={filterContestantsByName} />
			)}
			<section className='main'>
				{display === 'votingPage' && (
					<section className='container'>
						<SelectContestant
							isSelected={(id) => currentSelected?._id === id}
							renderData={filteredContestant}
							selectContestant={
								changeSelectedContestantPerCategory
							}
						/>
					</section>
				)}
				{display == 'loadingPage' && <div>Loading...</div>}
				{display !== 'votingPage' && (
					<div className='voted-c'>
						{display === 'votedPage' &&
							currentSelected?.votedName &&
							`Du hast abgestimmt für ${currentSelected.votedName}.`}
						{display === 'errorLoadingPage' && closedMessage}
						{display === 'spamPage' &&
							'Spam detected. Stop spamming.'}
						{display === 'inputCodePage' && (
							<div>
								<label htmlFor=''>
									Enter your code to your voting
								</label>
								<input placeholder='Enter code...'></input>
								<button>Submit</button>
							</div>
						)}
					</div>
				)}
			</section>
			<footer className='container'>
				{currentSelected &&
					display === 'votingPage' &&
					!currentSelected.votedName && (
						<div>
							<p>Änderung der Wahl nicht möglich.</p>
							<button className='vote-btn' onClick={vote}>
								Final Abstimmen
							</button>
						</div>
					)}
			</footer>
		</div>
	);
};

export default Voting;
