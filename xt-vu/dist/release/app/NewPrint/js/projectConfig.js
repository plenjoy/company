module.exports = {
  setProjectConfig: function(product,lppQuantity) {
    var showActionPanelProducts = ['AR','LPR','PR','flushMountPrint'];
    var showProjectSettingSelectProducts =['AR','LPR','PR','flushMountPrint'];
    var showDeleteProducts =['AR','LPR','PR','flushMountPrint'];
    var showDuplicateProducts =['AR','LPR','PR','flushMountPrint'];
    var showReplaceProducts =['LPP'];
    var showBorderEditProducts = ['PR'];
    var showStatusBarProducts = ['LPP'];
    var showTopPriceProducts = ['LPP'];
    var hoverShowOptionProducts = ['LPP'];
    var roundBorderProducts = ['LPP','flushMountPrint'];
    var thickShadowProducts = ['LPP','flushMountPrint'];
    var showChangeAllandFilterProducts = ['PR','PR','flushMountPrint'];
    var isShowPriceProduct = ['LPP'];
    var showQuantityInputProducts = ['PR','flushMountPrint'];
    var limitWidthConfig = {
        'LPP': 360,
        'PR': 0,
        'LPR': 0,
        'AR': 0,
        'flushMountPrint': 0
    };
    var lppQuantityConfig = {
        ten: 10,
        twenty: 20,
        thirty: 30
    };
    var maxPageNumConfig = {
        'LPP': lppQuantityConfig[lppQuantity],
        'PR': 0,
        'LPR': 0,
        'AR': 0,
        'flushMountPrint': 0
    };

    Store.isActionPanelShow = showActionPanelProducts.indexOf(product) !== -1;
    Store.isProjectSettingSelectShow = showProjectSettingSelectProducts.indexOf(product) !== -1;
    Store.isDeleteShow = showDeleteProducts.indexOf(product) !== -1;
    Store.isDuplicateShow = showDuplicateProducts.indexOf(product) !== -1;
    Store.isReplaceShow = showReplaceProducts.indexOf(product) !== -1;
    Store.isSnackBarShow = showDeleteProducts.indexOf(product) !== -1;
    Store.isOptionBarShow = showReplaceProducts.indexOf(product) !== -1;
    Store.isBorderEditorShow = showBorderEditProducts.indexOf(product) !== -1;
    Store.isStatusBarShow = showStatusBarProducts.indexOf(product) !== -1;
    Store.isTopPriceShow = showTopPriceProducts.indexOf(product) !== -1;
    Store.isQuantityInputShow = showQuantityInputProducts.indexOf(product) !== -1;
    Store.isHoverShowOption = hoverShowOptionProducts.indexOf(product) !== -1;
    Store.isRoundBorder = roundBorderProducts.indexOf(product) !== -1;
    Store.isThickShadow = thickShadowProducts.indexOf(product) !== -1;
    Store.isChangeAllAndFilterShow = showChangeAllandFilterProducts.indexOf(product) !== -1;
    Store.isShowPriceProduct = isShowPriceProduct.indexOf(product) !== -1;
    Store.limitWidth = limitWidthConfig[product];
    Store.maxPageNum = maxPageNumConfig[product];
  }
}
