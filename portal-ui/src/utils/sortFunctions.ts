interface sortInterface {
    accessKey: string;
}

export const usersSort = (a: sortInterface, b: sortInterface) => {
    if (a.accessKey > b.accessKey) {
        return 1;
    }
    if (a.accessKey < b.accessKey) {
        return -1;
    }
    // a must be equal to b
    return 0;
};

