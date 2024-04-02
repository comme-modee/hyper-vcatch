import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const KeywordWeek = lazy(() => import('./KeywordWeek'));
const Keyword24hour = lazy(() => import('./Keyword24hour'));
const KeywordMonth = lazy(() => import('./KeywordMonth'));
const Report = lazy(() => import('./Report'));

export default function Monitoring() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route index element={<KeywordWeek />} />
				<Route path="keyword-week" element={<KeywordWeek />} />
				<Route path="keyword-24hour" element={<Keyword24hour />} />
				<Route path="keyword-month" element={<KeywordMonth />} />
				<Route path="report" element={<Report />} />
			</Route>
		</Routes>
	);
}
