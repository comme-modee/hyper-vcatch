import { ThemeSettings, useAuthContext, useThemeContext } from '@/common';
import { lazy } from 'react';
import { Navigate, Route, Routes as ReactRoutes } from 'react-router-dom';
import VerticalLayout from '@/layouts/Vertical';
import HorizontalLayout from '@/layouts/Horizontal';
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
const Blog = lazy(() => import('../pages/blog'));
const Admin = lazy(() => import('../pages/admin'));

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
						<Route path="dashboard/*" element={<Dashboard />} />
						<Route path="user-account/*" element={<UserAccount />} />
						<Route path="monitoring/*" element={<Monitoring />} />
						<Route path="blog/*" element={<Blog />} />
						<Route path="admin/*" element={<Admin />} />
						<Route path="*" element={<Error404Alt />} />
					</Route>
				</ReactRoutes>
			)
		} else if (userRole === 'EMPL') {
			return (
				<ReactRoutes>
					<Route path="/*" element={<Layout />}>
						<Route path="dashboard/*" element={<Dashboard />} />
						<Route path="user-account/*" element={<UserAccount />} />
						<Route path="monitoring/*" element={<Monitoring />} />
						<Route path="blog/*" element={<Blog />} />
						<Route path="*" element={<Error404Alt />} />
					</Route>
				</ReactRoutes>
			)
		} else if (userRole === 'CLIENT') {
			return (
				<ReactRoutes>
					<Route path="/*" element={<Layout />}>
						<Route path="dashboard/*" element={<Dashboard />} />
						<Route path="user-account/*" element={<UserAccount />} />
						<Route path="monitoring/*" element={<Monitoring />} />
						<Route path="*" element={<Error404Alt />} />
					</Route>
				</ReactRoutes>
			)
		}
	} else {
		return <Navigate to="/account/login" replace />
	}
}
