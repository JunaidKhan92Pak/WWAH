export const extractMajorFromTitle = (courseTitle: string): string => {
    if (!courseTitle) return ""; // Handle empty values

    return courseTitle
        .replace(/^(BA Honours|BSc Honours|MA|MSc|PhD|Honours|BA|BSc)\s+/i, "")
        .replace(/\(Hons\)/i, "") // Remove "(Hons)"
        .trim(); // Remove extra spaces
};
