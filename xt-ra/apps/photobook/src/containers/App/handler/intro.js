import React from 'react';
import XStep from '../../../../../common/ZNOComponents/XStep';
import StepDescription from '../../../components/StepDescription';

const getSteps = (that) => {
  const tooltipStyle = {
    style: {
      backgroundColor: '#fff',
      zIndex: 100000,
      borderRadius: '6px',
      boxShadow: 'none'
    },
    arrowStyle: {
      color: '#fff',
      borderColor: false
    }
  };

  // 第一个提示：添加照片
  const addPhotoStep = {
    ele: (<XStep
      onPrevious={that.onPrevious}
      onNext={that.onNext}
      onSkip={that.onSkip}
    >
      <StepDescription
        activeIcon={0}
        iconsCount={6}
        title="ADD_PHOTOS_TITLE"
        description="ADD_PHOTOS_DESCRIPTION"
      />
    </XStep>),
    parent: '#addPhotoBtn',
    position: 'bottom',
    arrow: 'center',
    style: tooltipStyle
  };

  // 第二个提示：选择Layout
  const selectLayoutStep = {
    ele: (<XStep
      onNext={that.onNext}
      onSkip={that.onSkip}
    >
      <StepDescription
        activeIcon={1}
        iconsCount={6}
        title="SELECT_LAYOUT_TITLE"
        description="SELECT_LAYOUT_DESCRIPTION"
      />
    </XStep>),
    parent: '#Layouts',
    position: 'top',
    arrow: 'left',
    style: tooltipStyle
  };

  // 第三个提示：Action Bar
   const pageNavStep = {
    ele: (<XStep
      onNext={that.onNext}
      onSkip={that.onSkip}
    >
      <StepDescription
        activeIcon={2}
        iconsCount={6}
        title="PAGE_NAVIGATION_TITLE"
        description="PAGE_NAVIGATION_DESCRIPTION"
      />
    </XStep>),
    parent: '#Pages',
    position: 'top',
    arrow: 'left',
    style: tooltipStyle
  };


  // 第四个提示：切换Pages
  const editPhotobookStep = {
    ele: (<XStep
      onNext={that.onNext}
      onSkip={that.onSkip}
    >
      <StepDescription
        activeIcon={3}
        iconsCount={6}
        title="EDIT_PROTOBOOK_TITLE"
        description="EDIT_PROTOBOOK_DESCRIPTION"
      />
    </XStep>),
    parent: '#globalActionBar',
    position: 'bottom',
    arrow: 'center',
    style: tooltipStyle
  };

  // 第五个提示：保存
  const saveStep = {
    ele: (<XStep
      onNext={that.onNext}
      onSkip={that.onSkip}
    >
      <StepDescription
        activeIcon={4}
        iconsCount={6}
        title="SAVE_TITLE"
        description="SAVE_DESCRIPTION"
      />
    </XStep>),
    parent: '#saveProject',
    position: 'bottom',
    arrow: 'right',
    style: tooltipStyle
  };

  // 第六个提示：下单
  const orderStep = {
    ele: (<XStep
      skipText="Done"
      nextText="Now add photos to your book!"
      onSkip={that.onDone}
      onNext={that.onOrderStep}
    >
      <StepDescription
        activeIcon={5}
        iconsCount={6}
        title="ORDER_TITLE"
        description="ORDER_DESCRIPTION"
      />
    </XStep>),
    parent: '#orderProject',
    position: 'bottom',
    arrow: 'right',
    style: tooltipStyle
  };

  return [
    addPhotoStep,
    selectLayoutStep,
    pageNavStep,
    editPhotobookStep,
    saveStep,
    orderStep
  ];
};

export const trace = (that, fnName, isSkipParam = false) => {
  const { boundTrackerActions, xtroModal } = that.props;

  if (fnName) {
    const steps = getSteps(that);
    const currentStep = xtroModal.get('current');

    if (isSkipParam) {
      boundTrackerActions.addTracker(fnName);
    } else {
      let param = '';

      // 如果有值, 并且不是-1.
      if (!isNaN(currentStep) &&
        currentStep !== -1 &&
        currentStep < steps.length) {
        const step = steps[currentStep];
        param = step ? step.parent.replace('#', '') : '';
      }

      boundTrackerActions.addTracker(`${fnName},${param}`);
    }
  }
};

export const onOrderStep = (that) => {
  // 埋点.
  trace(that, 'ClickAddPhotosViaGuide', true);

  goto(that, -1);

  // 弹出上传图片的对话框.
  that.fileUploadNode.onClickInput && that.fileUploadNode.onClickInput();
};

export const goto = (that, stepIndex) => {
  const { boundXtroActions } = that.props;
  boundXtroActions.gotoStep(stepIndex);

  if (stepIndex === -1) {
    boundXtroActions.hide();
  }
};

export const onSkip = (that) => {
  // 埋点.
  trace(that, 'ClickSkip');
  goto(that, -1);
};

export const onDone = (that) => {
  // 埋点.
  trace(that, 'ClickDone', true);
  goto(that, -1);
};

export const onNext = (that) => {
  const { xtroModal } = that.props;
  const currentStep = xtroModal.get('current');
  const stepCounts = xtroModal.get('stepCounts');

  if (stepCounts > currentStep + 1) {
    goto(that, currentStep + 1);
  }
};

export const onPrevious = (that) => {
  const { xtroModal } = that.props;
  const currentStep = xtroModal.get('current');

  if (currentStep - 1 >= 0) {
    goto(that, currentStep - 1);
  }
};

export const showIntroModal = (that) => {
  const { boundXtroActions } = that.props;
  const steps = getSteps(that);

  boundXtroActions.show({
    current: 0,
    stepCounts: steps.length,
    steps
  });
};

