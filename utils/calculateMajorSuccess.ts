// export function calculateMajorSuccess(userMajor: string, courseTitle: string, synonyms: any) {
//     const normalizedUser = userMajor.toLowerCase().trim();
//     const categoryData = synonyms[normalizedUser];
//     console.log(
//         typeof window === "undefined"
//             ? "[SERVER LOG] This is running on the server"
//             : `[CLIENT LOG] This is running on the client: ${normalizedUser} - ${categoryData}`,
//     );
//     if (!categoryData) return 10; // user major not found

//     const title = courseTitle.toLowerCase();

//     if (categoryData["exact_match"].some((kw: string) => title.includes(kw.toLowerCase()))) return 100;
//     if (categoryData["closely_related"].some((kw: string) => title.includes(kw.toLowerCase()))) return 90;
//     if (categoryData["somewhat_related"].some((kw: string) => title.includes(kw.toLowerCase()))) return 70;
//     if (categoryData["weak_connection"].some((kw: string) => title.includes(kw.toLowerCase()))) return 50;
//     if (categoryData["unrelated"].some((kw: string) => title.includes(kw.toLowerCase()))) return 30;

//     return 10;
// }
import Fuse from "fuse.js";

export function calculateMajorSuccess(
    userMajor: string,
    courseTitle: string,
    synonyms: any
) {
    const normalizedUser = userMajor.toLowerCase().trim();
    const categoryData = synonyms[normalizedUser];

    if (!categoryData) {
        console.log("[LOG] User major not found in synonyms.json");
        return 10;
    }

    const title = courseTitle.toLowerCase();
    const fuseOptions = { includeScore: true, threshold: 0.4 };

    let matchedScore = 10;
    let matchCount = 0;

    const keywordLists = [
        { list: categoryData["exact_match"], score: 100 },
        { list: categoryData["closely_related"], score: 90 },
        { list: categoryData["somewhat_related"], score: 70 },
        { list: categoryData["weak_connection"], score: 50 },
        { list: categoryData["unrelated"], score: 10 },
    ];

    for (const { list, score } of keywordLists) {
        if (!list) continue;

        // Direct match
        const directMatches = list.filter((kw: string) =>
            title.includes(kw.toLowerCase())
        );
        if (directMatches.length > 0) {
            matchCount += directMatches.length;
            matchedScore = Math.max(matchedScore, score);
            continue;
        }

        // Fuzzy match
        const fuse = new Fuse(list.map((kw: string) => kw.toLowerCase()), fuseOptions);
        const fuzzyMatches = fuse.search(title).filter(r => r.score! < 0.4);

        if (fuzzyMatches.length > 0) {
            matchCount += fuzzyMatches.length;
            matchedScore = Math.max(matchedScore, score);
        }
    }

    if (matchCount === 0) {
        matchedScore = 10;
    } else if (matchCount === 1) {

        if (matchedScore === 100) matchedScore = 100;
        else if (matchedScore === 90) matchedScore = 90;
        else if (matchedScore === 70) matchedScore = 70;
        else matchedScore = 50;
    }



    // console.log(`[RESULT] matchedScore: ${matchedScore}, matchCount: ${matchCount}`);
    return matchedScore;
}
