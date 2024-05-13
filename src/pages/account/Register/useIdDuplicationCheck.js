import { authApi, useNotificationContext } from "@/common";

export default function useIdDuplicationCheck() {
    const { showNotification } = useNotificationContext();

    const idDuplicationCheck = async ( username ) => {
		// console.log(username, "아이디 중복 체크")
        try {
            const res = await authApi.idDuplicationCheck(username);
            if(res) {
                showNotification({ message: "사용가능한 아이디입니다.", type: 'success' });
            } else {
                showNotification({ message: "중복된 아이디입니다. 다른 아이디를 입력하세요.", type: 'error' });
            }
        } catch {

        }
	}

    return { idDuplicationCheck };
};

