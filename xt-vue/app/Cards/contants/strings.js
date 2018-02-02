var textFormTypes = exports.textFormTypes = {
    DATE: 'Date',
    TIME: 'Time',
    TEXT: 'Text',
    PHONE: 'Phone',
    NUMBER: 'Number',
    LENGTH: 'Length',
    WEIGHT: 'Weight',
    TEXTAREA: 'Textarea'
};

var inputType = exports.inputType = {
    INPUT: 'input',
    TEXTAREA: 'textarea',
    NUMBER: 'number',
    PHONE: 'phone'
}

exports.tagFormats = {
    'Text': inputType.INPUT,
    'Date': 'MM/DD/YYYY',
    'Time': 'hh:mm a',
    'Phone': inputType.PHONE,
    'Number': inputType.NUMBER,
    'Length': inputType.INPUT,
    'Weight': inputType.INPUT,
    'Textarea': inputType.TEXTAREA
};

exports.cardTypes = {
    FOLDER: 'FD',
    FLAT: 'FT'
};

exports.formatTypes = {
    TOP: 'TOP',
    SIDE: 'SIDE'
}

exports.pageTypes = {
    FRONT_PAGE: 'frontPage',
    INSIDE_PAGE: 'insidePage'
}