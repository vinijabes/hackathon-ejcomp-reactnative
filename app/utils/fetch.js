const getName = (token = '') => {
	if(token == ''){
		return "Não conectado"
	}

	return fetch(`https://graph.facebook.com/me?access_token=${token}`, {
		method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });
}

export {
	getName
}