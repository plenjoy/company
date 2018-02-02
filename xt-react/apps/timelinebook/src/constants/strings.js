// 封面类型.
export const coverTypes = {
  TLBSC: 'TLBSC',
  TLBHC: 'TLBHC'
};
export const clientType = 'H5';
// 组件zindex的定义.
export const zIndex = {
  notification: 99999,
  modal: 50000,
  actionBar: 40000,
  shadow: 30000,
  elementBase: 100,
  backgroundImage: 2,
  elements: 1
};

export const oAuthTypes = {
  FACEBOOK: 'facebook',
  INSTAGRAME: 'instagram'
};

export const volumeLength = 100;

export const defaultSummary = {
  client: 'H5',
  cover: 'TLBHC',
  leatherColor: 'none',
  paper: 'SP',
  paperThickness: 'TLBthin',
  product: 'TLB',
  size: '6X6'
};

export const managePhotoViewTypes = {
  included: 'INCLUDED',
  exclude: 'EXCLUDE'
};

export const elementTypes = {
  photoElement: 'PhotoElement',
  logoElement: 'LogoElement',
  spineTextElement: 'SpineTextElement',
  textElement: 'TextElement'
};

export const spineTextInfo = {
  fontColor: '#000000',
  fontFamily: 'Roboto',
  textAlign: 'left',
  verticalTextAlign: 'middle'
};

export const innerTextInfo = {
  fontColor: '#000000',
  fontFamily: 'Roboto',
  textAlign: 'left',
  verticalTextAlign: 'middle'
}

export const smallViewWidthInMyProjects = 400;

export const securityString = {
  customerId: '',
  token: '',
  timestamp: '',
  encProjectId: '',

  get() {
    return {
      customerId: this.customerId,
      token: this.token,
      timestamp: this.timestamp,
      encProjectId: this.encProjectId
    }
  },

  set(options) {
    this.customerId = options.customerId || '';
    this.token = options.token;
    this.timestamp = options.timestamp;
    this.encProjectId = options.encProjectId || '';
  }
};