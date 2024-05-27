import { Route, Routes as ReactRoutes } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import ErrorPages from '@/pages/error';
import ErrorPageNotFound from '@/pages/error/PageNotFound';
import Login from '@/pages/account/Login';
import Logout from '@/pages/account/Logout';
import Register from '@/pages/account/Register';
export default function AppRoutes() {
	return (
		<ReactRoutes>
			<Route index element={<Login />} />
			<Route path="/*" element={<ProtectedRoutes />} />
			<Route path="/logout" element={<Logout />} />
			<Route path="/register" element={<Register />} />
			<Route path="/error/*" element={<ErrorPages />} />
			<Route path="*"  element={<ErrorPageNotFound />} />
		</ReactRoutes>
	);
}
