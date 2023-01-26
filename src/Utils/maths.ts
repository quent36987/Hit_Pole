function generateUEID(): string {
    const first = (Math.random() * 46656) | 0;
    const second = (Math.random() * 46656) | 0;
    const first2 = ('000' + first.toString(36)).slice(-3);
    const second2 = ('000' + second.toString(36)).slice(-3);

    return `${first2}${second2}`;
}

export { generateUEID };
