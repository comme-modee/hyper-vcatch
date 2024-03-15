import { ThemeSettings, useAuthContext, useThemeContext } from '@/common';
import { lazy } from 'react';
import { Navigate, Route, Routes as ReactRoutes } from 'react-router-dom';
import VerticalLayout from '@/layouts/Vertical';
import HorizontalLayout from '@/layouts/Horizontal';
import Root from './Root';
import UserAccount from '@/pages/user-account';

/**
 * routes import
 */
const Dashboard = lazy(() => import('../pages/dashboard'));
const Apps = lazy(() => import('../pages/apps'));
const OtherPages = lazy(() => import('../pages/otherpages'));
const UI = lazy(() => import('../pages/ui'));
const Error404Alt = lazy(() => import('../pages/otherpages/Error404Alt'));

export default function ProtectedRoutes() {
	const { settings } = useThemeContext();
	const Layout =
		settings.layout.type == ThemeSettings.layout.type.vertical
			? VerticalLayout
			: HorizontalLayout;

	const { user } = useAuthContext();

	return user ? (
		<ReactRoutes>
			<Route path="/*" element={<Layout />}>
				<Route index element={<Root />} />
				<Route path="user-account/*" element={<UserAccount />} />
				<Route path="dashboard/*" element={<Dashboard />} />
				<Route path="apps/*" element={<Apps />} />
				<Route path="pages/*" element={<OtherPages />} />
				<Route path="ui/*" element={<UI />} />
				<Route path="*" element={<Error404Alt />} />
			</Route>
		</ReactRoutes>
	) : (
		<Navigate to="/account/login" replace />
	);
}
