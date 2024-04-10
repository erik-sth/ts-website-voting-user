export type Project = {
	_id: string;
	name: string;
	owner: string;
	categories: Categories[];
	config: {
		useTime: boolean;
		votingStartDayAndTime: Date;
		votingEndDayAndTime: Date;
		votingEnabled: boolean;
		limitVotesToOnePerIp: boolean;
	};
};

export type Categories = {
	option1: CatergorieOption;
	option2: CatergorieOption;
	title: string;
};
export type CatergorieOption = {
	key: string;
	name: string;
	color: colorSelection;
};
export type colorSelection = 'blue' | 'pink' | 'white';

export type ServerExpectedProjectData = Pick<
	Project,
	'name' | 'config' | 'categories'
>;
