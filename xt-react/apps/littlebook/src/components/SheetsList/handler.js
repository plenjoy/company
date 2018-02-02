/**
 * 将小于当前显示页的, 移到左边, 大于当前显示页的移到右边.
 * @param  {number} translateX 移动的大小.
 * @param  {number} index sheet的索引. 0: 第一页, 1： 第二页, 2:第三页.
 * @param  {number} paginationIndex 当前翻到第几页, 0: 第一页, 1： 第二页, 2:第三页.
 */
export const getAllStyles = (translateX) => {
    const styles = {
        prev: {
            transform: `translateX(${-translateX}px)`,
            WebkitTransform: `translateX(${-translateX}px)`,
            OTransform: `translateX(${-translateX}px)`,
            opacity: 0.5
        },
        current: {
            transform: `translateX(0)`,
            WebkitTransform: `translateX(0)`,
            OTransform: `translateX(0)`,
            opacity: 1       
        },
        next: {
            transform: `translateX(${translateX}px)`,
            WebkitTransform: `translateX(${translateX}px)`,
            OTransform: `translateX(${translateX}px)`,
            opacity: 0.5          
        }
    };

    return styles;
};
