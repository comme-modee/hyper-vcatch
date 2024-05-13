import { useState } from "react";

export default function useErrorAni () {
    const [ errorAni, setErrorAni ] = useState('error-ani');

	const handleErrorAni = () => {
		setErrorAni('');
		setTimeout(() => {
			setErrorAni('error-ani');
		}, 0);
	}

    return { errorAni, handleErrorAni }
}