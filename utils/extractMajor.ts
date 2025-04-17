export const extractMajorFromTitle = (courseTitle: string): string => {
    if (!courseTitle) return ""; // Handle empty values
    console.log(courseTitle);

    return courseTitle
        .replace(/^(BA Honours|Bachelor of|BSc Honours|MA|MSc|PhD|Honours|BA|BSc)\s+/i, "")
        .replace(/\(Hons\)/i, "") // Remove "(Hons)"
        .replace(/\s+\(.*?\)/g, "") // Remove anything in parentheses
        .replace(/(Honours|BSc|MA|MSc|PhD)\s+/i, "") // Remove degree types
        .trim(); // Remove extra spaces
};
