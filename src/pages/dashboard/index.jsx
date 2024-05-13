import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Ecommerce = lazy(() => import('./Ecommerce'));

export default function Dashboard() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route index element={<Ecommerce />} />
			</Route>
		</Routes>
	);
}
