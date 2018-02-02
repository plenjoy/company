import { elementTypes } from '../../constants/strings';
import { isEncode } from '../../utils/encode';
import { superstruct } from '../../utils/superstruct';
import { isNumber } from 'lodash';

const struct = superstruct({
  types: {
    hexColor: value => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value),
    encodeString: value => isEncode(value),
    zeroToOne: value => isNumber(value) && value >= 0 && value <= 1
  }
});

const elementSchema = {
  id: 'string',

  x: 'number',
  y: 'number',
  width: 'number',
  height: 'number',

  px: 'number',
  py: 'number',
  pw: 'number',
  ph: 'number',

  dep: 'number',
  rot: 'number',

  elType: 'string?',
  lastModified: 'number?'
};

const photoElementSchema = Object.assign({}, elementSchema, {
  encImgId: 'string | null?',
  imageid: 'string | number | null?',

  cropLUX: 'zeroToOne?',
  cropLUY: 'zeroToOne?',
  cropRLX: 'zeroToOne?',
  cropRLY: 'zeroToOne?',

  imgFlip: 'boolean'
});

const ImageStruct = struct.interface({
  width: 'number',
  height: 'number'
});

function ImageElement(data, imageData) {
  const ImageElementStruct = struct.interface({
    cropLUX: 'zeroToOne',
    cropLUY: 'zeroToOne',
    cropRLX: 'zeroToOne',
    cropRLY: 'zeroToOne'
  });
  ImageStruct(imageData);
  ImageElementStruct(data);

  const isSwitched = Math.abs((data.imgRot / 90) % 2) === 1;
  const imageWidth = isSwitched ? imageData.height : imageData.width;
  const imageHeight = isSwitched ? imageData.width : imageData.height;

  const cropPW = data.cropRLX - data.cropLUX;
  const cropPH = data.cropRLY - data.cropLUY;

  const cropWidth = imageWidth * cropPW;
  const cropHeight = imageHeight * cropPH;

  const elementRatio = data.width / data.height;
  const cropRatio = cropWidth / cropHeight;

  const MAX_DIFF = 0.03;

  if (Math.abs(elementRatio - cropRatio) > MAX_DIFF) {
    const error = new Error(
      `The value between elementRatio(${elementRatio}) and cropRatio(${cropRatio}) is lager than ${MAX_DIFF}`
    );

    throw error;
  }
}

function PhotoElement(data, imageData) {
  const PhotoElementStruct = struct(
    Object.assign({}, photoElementSchema, {
      type: struct.literal(elementTypes.photo),
      imgRot: struct.enum([0, 90, 180, -90]),

      border: struct.optional({
        color: 'hexColor',
        size: 'number',
        opacity: 'number'
      }),

      style: struct.optional({
        effectId: 'number',
        opacity: 'number',
        brightness: 'number?',
        contrast: 'number?',
        saturation: 'number?',
        gradient: struct.optional({
          gradientEnable: 'boolean',
          gradientType: 'string',
          gradientAngle: 'number?',
          gradientMidpoint: 'number?'
        }),
        shadow: struct.optional({
          angle: 'number',
          blur: 'number',
          color: 'hexColor',
          distance: 'number',
          enable: 'boolean',
          opacity: 'number'
        })
      })
    })
  );

  PhotoElementStruct(data);

  if (data.encImgId) {
    ImageElement(data, imageData);
  }
}

function StickerElement(data, stickerData) {
  const StickerElementStruct = struct(
    Object.assign({}, elementSchema, {
      type: struct.literal(elementTypes.sticker),
      decorationId: 'string',

      cropLUX: struct.literal(0),
      cropLUY: struct.literal(0),
      cropRLX: struct.literal(1),
      cropRLY: struct.literal(1)
    })
  );

  StickerElementStruct(data);

  if (data.decorationId) {
    ImageElement(data, stickerData);
  }
}

function BackgroundElement(data, backgroundData) {
  const BackgroundElementStruct = struct(
    Object.assign({}, elementSchema, {
      type: struct.literal(elementTypes.background),
      backgroundId: 'string',
      suffix: 'string?',

      cropLUX: 'zeroToOne',
      cropLUY: 'zeroToOne',
      cropRLX: 'zeroToOne',
      cropRLY: 'zeroToOne'
    })
  );

  BackgroundElementStruct(data);

  if (data.backgroundId) {
    ImageElement(data, backgroundData);
  }
}

function TextElement(data) {
  const TextElementStruct = struct(
    Object.assign({}, elementSchema, {
      type: struct.literal(elementTypes.text),
      fontSize: 'number',
      fontWeight: 'string',
      fontFamily: 'string',
      fontColor: 'hexColor',
      textAlign: struct.enum(['left', 'center', 'right']),
      textVAlign: struct.enum(['top', 'middle', 'bottom']),
      text: 'string | undefined'
    })
  );

  TextElementStruct(data);
}

export { PhotoElement, TextElement, StickerElement, BackgroundElement };
