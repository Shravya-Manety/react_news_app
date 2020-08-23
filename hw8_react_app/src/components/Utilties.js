export function getSectionClassName(sectionName) {
    switch (sectionName) {
        case 'WORLD':
            return 'section-world'
        case 'POLITICS':
            return 'section-politics'
        case 'BUSINESS':
            return 'section-business'
        case 'TECHNOLOGY':
            return 'section-technology'
        case 'SPORTS':
            return 'section-sports'
        default:
            return 'section-other'
    }
}

export function formatDescription(description) {
    const regEx= new RegExp(".{0,}?(?:\\.|!|\\?|[.\"]|[.”]|[.']|[.’])(?:(?=\\ [A-Z0-9])|$)", "g");
    const sentenceList = description.match(regEx);
    let basicDesc, advancedDesc
    if(sentenceList.length > 4){
        basicDesc = sentenceList.slice(0,4).join(" ")
        advancedDesc = sentenceList.slice(4).join(" ")
    }
    else{
        basicDesc = sentenceList.join(" ")
    }
    return [basicDesc, advancedDesc]
}