// model -- Store

// import model Prj
var ProjectList=[];

// adding private property



var Domains = require('Domains');
var Spec = require('Spec');
module.exports = {
    isPreview: false,
    isNewProject: false,
    previewSource: '',        // '' | 'self' -- client preview, 'share' -- 3rd party share, 'factory' -- factory preview
    operateMode: 'idle',      // to indicate which operating mode is ON for now
                              // ''|'idle' -- default, nothing
                              // 'drag' -- in dragging, drag an element or drag an image
                              // 'scale' -- in scaling, scale an element
    isLostFocus: true,
    isFrontPage: true,
    isInnerPreviewShow: false,
    isChangePageShow: false,
    isPopupShow : false,
    isFrameOptionsShow : false,
    OptionType : 'frame',
    isImageUploadShow: false,
    isImageCropShow: false,
    isOptionsViewShow: false,
    isTextEditorShow: false,
    isOrderViewShow: false,
    isMattingGlassShow : false,
    isMattingGlassEditShow : false,
    isEditBorderShow : false,
    isFrameLayer : false,
    isBorderShow : false,
    isPrjSaved: false,
    isPopSave: true,
    isShowHelp:false,
    isShowClone:false,
    isTrialPriceShow:false,
    mirrorLength : 0,
    isMirrorBorder : false,
    isShowContactUs:false,
    isPageLoadingShow : true,
    cancelledUpload : [],
    currentUploadCount : 0,
    successfullyUploaded : 0,
    errorUploaded : 0,
    currentSuccessUpload : 0,
    currentErrorUpload : 0,
    errorUploadedFiles : [],
    retryId : -1,
    cancelByX : false,
    chooseTimes : 0,
    uploadTimes : 0,
    filesTotal : 0,
    filesTotalInQueue: 0, // files to be uploaded total in queue
    filesCountInQueue: 0, // files uploaded count in queue
    saveImage : false,    // to indicate if should show image when saving
    isSwitchLoadingShow : false,
    projectSettings: ProjectList, // all common project params
    spec: Spec,
    domains: Domains,

    cropImageRatio: 1, // preview image in crop window ratio,  cropImageRatio = preview size / real size
    selectedPageIdx: 0, // current actived page's index
    elementDragged: '',
    photoPrice:{
        sPrice: '',
        oriPrcie: '',
        couponId: '',
        options: {},
        allSize: []
    },
    priceChange : false,
    dragData: {
        imageId: '',
        sourceImageUrl: '',
        cursorX: 0,     // to indicate what position when user drag the preview image in image list
        cursorY: 0,
        isFromList: false
    },
    cropParams: {}, // to save temp crop params of selection
    projects: [],          // to store all projects' breif params
    pages: [],            // to store the current project pages setting for rendering
    // canvas: {
    // 	isInited: false,
    // 	width: 0,				// canvas width
    // 	height: 0,			// canvas height
    // 	ratio: 1,				// view size / real size,  eg. ratio = width / oriWidth
    // 	oriWidth: 0,		// real size
    // 	oriHeight: 0,
    //  oriSpineWidth: 0,
    // 	bleedings: {},	// bleeding sizes for front end, = bleeding size + wrap size
    //  realBleedings: {}		// real bleedings for backend
    // 	selectedIdx: 0,	// the image index in params which was selected
    // 	paper: '',			// svg paper object
    // 	params: [],			// all elements params/settings from backend
    // 	elements: [],		// svg current saved elements params/settings, with extra data
    // 									// idx, dep, type('image'/'text'), imageUrl(current selected image path)/text, vWidth, vHeight (the view/handler size), cropX, cropY, cropW, cropH(the real crop positions done) ...
    // 									// fontFamily, fontWeight, fontSize, color(rgba -- >), opacity(0 - 1)
    // 	trans: [],			// the objects those store transforming
    //  warns: [],
    //  outerLine: '',		// to store the outer line element
    //  bleedingRibbonLeft: '',		// to store the left bleeding element
    //  bleedingRibbonRight: '',		// to store the right bleeding element
    //  bleedingRibbonTop: '',		// to store the top bleeding element
    //  bleedingRibbonBottom: '',		// to store the bottom bleeding element
    //  spineLeft: '',	// to store the left spine element
    //  spineRight: '',	// to store the right spine element
    // 	elementBg: ''		// to store the bg element
    // },
    oriImageIds: [], // original valid image ids request from backend those for uploading
    imageList: [], // all valid images(uploaded) info
    fontList: [],
    ctrls: {
        tcResize: '', // time control of resizing interval
        lastTranEvent: '',
        isDragStarted: false
    },
    watches: {
      flagRepaint: false, // vue watch flag of repaint event
      isSpecLoaded: false,
      isProjectLoaded: false,
      isRefreshImage: false,
      isCropThisImage: false,
      isChangeThisText: false,
      isOnDrop: false,
      isChangeDepthFront: false,
      isRemoveElement: false,
      isReplaceImage : false,
      isApplyLayout : false,
      isProjectComplete : false,
      isProjectInfoLoaded: false,
      isProjectOrderedStateLoaded: false
    },
    watchData: {
      changeDepthIdx: '',
      cropImageIdx: '',
      removeElementType: '',
      removeElementIdx: ''
    },
    dropData: {
        ev: '',
        newAdded: false,        // indicate if it's dropping on 'nothing' so that a new element should be added
        isBg: false,             // indicate the bg layer for adding background image
        idx : ''
    },
    warnMargin: {
        left: 30,
        top: 30,
        width: 15,
        height: 15,
        visible: false,
        rate: 30
    },
    warnSettings : {
        resizeLimit : 30,
        resizeWarnMsg : 'beyond resize limit!',
        warnImageWidth : 10,
        warnImageHeight: 10,
        visible : false
    },
    uploadProgress: [],
    webClientId: 1,
    currentSelectProjectIndex:0,
    userSettings:{},
    projectId:'',
    projectXml:'',
    title:'test',
    itemListNum:0,
    fromCart:false,
    colorOptionList: [
        { type: 'White', backgroundImage: 'assets/img/White-0.png', normalColor: 'assets/img/white-normal.png', pressColor: 'assets/img/white-pressed.png' },
        { type: 'Black', backgroundImage: 'assets/img/Black-0.png', normalColor: 'assets/img/black-normal.png', pressColor: 'assets/img/black-pressed.png' },
        { type: 'SportGrey', backgroundImage: 'assets/img/SportGrey-0.png', normalColor: 'assets/img/grey-normal.png', pressColor: 'assets/img/grey-pressed.png' },
        { type: 'NavyBlue', backgroundImage: 'assets/img/NavyBlue-0.png', normalColor: 'assets/img/navy-normal.png', pressColor: 'assets/img/navy-pressed.png' },
        { type: 'RoyalBlue', backgroundImage: 'assets/img/RoyalBlue-0.png', normalColor: 'assets/img/royal-normal.png', pressColor: 'assets/img/royal-pressed.png' }
    ],
    projectType:'littleModernCanvas',
    orderType : 'commonProduct',
    isFromMarketplace:false,
    isFromFactory: false,
    vm: null,
    bgColor:16777215, //white
    isCanvas : false,
    projectInfo:{
        isOrdered:false,
        isInCart:false,
        isInMarket:false
    },
    uploadAcceptType:'image/jpeg,image/x-png,image/png',
    // uploadAcceptType:'image/*',
    screenshotSize : {
        width : 200,
        height : 200
    },
    barPosition : {
        x : 0,
        y : 0
    },
    isSingleImageUploadShow : false,
    isShowPostToSale:false,
    templateList:[],
    autoLayout : true,
    cycleLock : false,
    isBgLoaded : false,
    isLogoClicked: false,
    queueKey : false,
    mattCycleLock : false,
    isMattLoaded : false,
    mattQueueKey : false,
    disableArray:[],
    checkFailed:false,
    isShowProgress : false,
    productTitle:'',
    firstRender: true,
    isWoodPrintOptionUpdated: false,
    isShowCategoryOptions: true,
    mainProjectUid: '',
    encImageId: '',
    isNewInsertProject: false,
    isShowAddPhotoText: true,
    warnTipLimit: 200,
    isOrderedPreview: false,
    warnTipMargin: 45,
    baseProject: {},
    emptyImage: '',
    isRemark: false,
    token: '',
    pUser: '',
    selectedPageGuid: '',
    submitTitle:'canvas',
    isTotalPriceShow: false,
    boxLimit: {},
    isProjectUpgrade: false,
    beforeUpgradeScreenshot: '',
    newUploadedImg: [],
    initQuantitys: [],
    // 升级弹框的默认值
    oriSize: '8X10',
    upgradeSize: '11X14',
    // 升级对应尺寸列表
    upgradeSizeMaps: {
        //oriSize: upgradeSize
        '8X10': '11X14',
        '10X10': '14X14',
    },
    upgradeSmallSrc: '',
    upgradeBigSrc: ''
};
