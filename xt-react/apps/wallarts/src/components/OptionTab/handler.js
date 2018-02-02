import React from 'react';

export const optionChangeHandler = (that, key, value) => {
	const { data, actions } = that.props;
    const { boundProjectActions, boundTrackerActions, boundLoadingModalAction } = actions;
    
    if(key === "canvasBorderColor"){
    	boundProjectActions.changeCanvasBorderColor({ [key]: value });
    }else{
		boundProjectActions.changeProjectSetting({ [key]: value });
    }
    
};