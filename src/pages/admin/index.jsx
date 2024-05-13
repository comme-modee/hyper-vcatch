import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Member = lazy(() => import('./Member/Member'));

export default function Admin() {
	
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route index element={<Member />} />
				<Route path="member" element={<Member />} />
			</Route>
		</Routes>
	);
}
