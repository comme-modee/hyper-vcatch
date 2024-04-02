import { Navigate } from 'react-router-dom';

const Root = () => {
	const getRootUrl = () => {
		const url = 'monitoring/keyword-week';
		return url;
	};

	const url = getRootUrl();

	return <Navigate to={`/${url}`} />;
};

export default Root;
