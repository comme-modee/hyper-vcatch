import { useAuthContext, useUserInfoContext } from '@/common/context';
import { useEffect } from 'react';

export default function useLogout() {
	const { removeSession } = useAuthContext();
	const { removeUserInfo } = useUserInfoContext();

	useEffect(() => {
		removeSession();
		removeUserInfo();
	}, [removeSession, removeUserInfo]);
}
