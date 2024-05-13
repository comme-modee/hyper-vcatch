import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Visitor = lazy(() => import('./Visitor/Visitor'));
const Traffic = lazy(() => import('./Traffic/Traffic'));

export default function Blog() {
	
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route index element={<Visitor />} />
				<Route path="visitor" element={<Visitor />} />
				<Route path="traffic" element={<Traffic />} />
			</Route>
		</Routes>
	);
}
