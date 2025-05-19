export function convertCategoryEngToAr(category: string): string {
    switch (category) {
        case "IslamicStudies":
            return "الدراسات الإسلامية";
        case "DesignAndArts":
            return "التصميم والفنون";
        case "Medicine":
            return "الطب";
        case "Entrepreneurship":
            return "ريادة أعمال";
        case "Programming":
            return "برمجة";
        case "Technology":
            return "تكنولوجيا";
        case "Law":
            return "القانون";
        case "HealthAndNutrition":
            return "الصحة والتغذية";
        case "EducationAndTeaching":
            return "التعليم والتدريس";
        case "Science":
            return "العلوم";
        case "Engineering":
            return "الهندسة";
        default:
            return category;
    }
}

export function convertCategoryArToEng(category: string): string {
    switch (category) {
        case "الدراسات الإسلامية":
            return "IslamicStudies";
        case "التصميم والفنون":
            return "DesignAndArts";
        case "الطب":
            return "Medicine";
        case "ريادة أعمال":
            return "Entrepreneurship";
        case "برمجة":
            return "Programming";
        case "تكنولوجيا":
            return "Technology";
        case "القانون":
            return "Law";
        case "الصحة والتغذية":
            return "HealthAndNutrition";
        case "التعليم والتدريس":
            return "EducationAndTeaching";
        case "العلوم":
            return "Science";
        case "الهندسة":
            return "Engineering";
        default:
            return category;
    }
}
