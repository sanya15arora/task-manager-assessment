
export const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        return "Email is invalid";
    }

}

export const getInitials = (name: string): string => {
    let initials = "";

    if (!name)
        return initials;

    const words = name.split(" ");
    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }
    return initials.toUpperCase();
}


export const validatePassword = (password: string) => {
    if (!password) return "Password is required.";

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])(?=\S+$).{8,}$/;

    if (!passwordRegex.test(password)) {
        return "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character. Spaces are not allowed.";
    }

    return null;
};
