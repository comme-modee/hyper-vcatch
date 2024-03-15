import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Ecommerce = lazy(() => import('./Ecommerce'));
const Analytics = lazy(() => import('./Analytics'));
const Project = lazy(() => import('./Project'));
const CRM = lazy(() => import('./CRM'));
const EWallet = lazy(() => import('./E-Wallet'));

export default function Dashboard() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route index element={<Ecommerce />} />
				<Route path="analytics" element={<Analytics />} />
				<Route path="ecommerce" element={<Ecommerce />} />
				<Route path="project" element={<Project />} />
				<Route path="crm" element={<CRM />} />
				<Route path="e-wallet" element={<EWallet />} />
			</Route>
		</Routes>
	);
}
