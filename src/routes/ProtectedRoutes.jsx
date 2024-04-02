import { ThemeSettings, useAuthContext, useThemeContext } from '@/common';
import { lazy } from 'react';
import { Navigate, Route, Routes as ReactRoutes } from 'react-router-dom';
import VerticalLayout from '@/layouts/Vertical';
import HorizontalLayout from '@/layouts/Horizontal';
import Root from './Root';
import useGetUserRole from '@/common/api/useGetUserRole';

/**
 * routes import
 */
const Dashboard = lazy(() => import('../pages/dashboard'));
const Apps = lazy(() => import('../pages/apps'));
const OtherPages = lazy(() => import('../pages/otherpages'));
const UI = lazy(() => import('../pages/ui'));
const Error404Alt = lazy(() => import('../pages/otherpages/Error404Alt'));
const UserAccount = lazy(() => import('../pages/user-account'));
const Monitoring = lazy(() => import('../pages/monitoring'));

export default function ProtectedRoutes() {
	const { settings } = useThemeContext();
	const Layout =
		settings.layout.type == ThemeSettings.layout.type.vertical
			? VerticalLayout
			: HorizontalLayout;

	const { user } = useAuthContext();
	const userRole = useGetUserRole();

	if (user) {
		if (userRole === 'ADMIN') {
			return (
				<ReactRoutes>
					<Route path="/*" element={<Layout />}>
					<Route index element={<Root />} />
					<Route path="monitoring/*" element={<Monitoring />} />
					<Route path="user-account/*" element={<UserAccount />} />
					<Route path="*" element={<Error404Alt />} />
					</Route>
				</ReactRoutes>
			)
		} else if (userRole === 'GENERAL') {
			return (
				<ReactRoutes>
					<Route path="/*" element={<Layout />}>
					<Route index element={<Root />} />
					<Route path="monitoring/*" element={<Monitoring />} />
					<Route path="user-account/*" element={<UserAccount />} />
					<Route path="*" element={<Error404Alt />} />
					</Route>
				</ReactRoutes>
			)
		}
	} else {
		return <Navigate to="/account/login" replace />
	}
}
