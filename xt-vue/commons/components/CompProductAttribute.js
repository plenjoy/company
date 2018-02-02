module.exports = {
	computed: {

        productText: function() {
            switch (Store.projectSettings[Store.currentSelectProjectIndex].product) {
                case 'PO':
                    return 'Poster';
                    break;
                case 'LPR':
                    return 'Large Photo Prints';
                    break;
                case 'AR':
                    return 'Art Prints';
                    break;
                case 'PhoneCase':
                    return 'Phone Case';
                    break;
                default:
                    return '[ERR PRODUCT]';
            };
        },

	}

}