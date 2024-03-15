import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Status = lazy(() => import('./Status'));
const Edit = lazy(() => import('./Edit'));
const UsagePeriod = lazy(() => import('./UsagePeriod'));

export default function UserAccount() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route index element={<Status />} />
				<Route path="status" element={<Status />} />
				<Route path="edit" element={<Edit />} />
				<Route path="usage-period" element={<UsagePeriod />} />
			</Route>
		</Routes>
	);
}
