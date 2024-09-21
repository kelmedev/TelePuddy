export const validateEmail = (email: string): string => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email) ? "" : "Email inválido";
};

export const validatePassword = (password: string): string => {
	return password ? "" : "Senha não pode estar vazia";
};
