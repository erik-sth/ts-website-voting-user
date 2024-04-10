export type page =
	| 'votingPage'
	| 'inputCodePage'
	| 'votedPage'
	| 'spamPage'
	| 'invalidInputPage'
	| 'errorLoadingPage'
	| 'loadingPage';

export type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;
