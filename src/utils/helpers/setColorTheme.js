export const setColorTheme = (category, categoryArray) => {
    const myCategory = categoryArray.filter((item) => item.name === category);
    return myCategory[0]?.color;
};
