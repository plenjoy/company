import React from 'react';
import twemoji from 'twemoji';

let textIndex = 0;

export default (text = '', options = {}) => {
  const textComponents = [];
  const { onlySpan = false } = options;

  // emoji表情转义，分离emoji和文本为textArray
  const parsedText = twemoji.parse(text);
  const textArray = parsedText.split(/\<img|\/\>/).filter(textItem => textItem);

  // 遍历textArray
  for(const textItem of textArray) {
    // 判断textItem是否是emoji表情
    const isImage =
      textItem.includes(' class="') &&
      textItem.includes(' draggable="') &&
      textItem.includes(' alt="') &&
      textItem.includes(' src="https://twemoji.maxcdn.com/');

    let textKey = `text-${textIndex}-emoji-${textComponents.length}`;
    
    // 如果textItem是emoji表情
    if(isImage) {
      const attrString = textItem.trim().replace(/\"/g, '');
      const attrArray = attrString.split(' ');
      const imageAttr = {};

      attrArray.forEach(attrItem => {
        let attrKey = attrItem.split('=')[0];
        let attrValue = attrItem.split('=')[1];

        if(['class', 'draggable', 'alt', 'src'].indexOf(attrKey) !== -1) {
          attrKey = attrKey === 'class' ? 'className' : attrKey;
          imageAttr[attrKey] = attrValue;
        }
      });

      // 获取emoji组件
      onlySpan
        ? textComponents.push(<span key={textKey} className="emoji"></span>)
        : textComponents.push(<img key={textKey} {...imageAttr} />);
    }
    // 如果文本为文字
    else {
      const plainTextArray = textItem.split(/\n/g);
      const isPlainTextHasBreak = plainTextArray.length !== 1;

      plainTextArray.forEach((plainTextItem, index) => {
        // 获取文本组件
        textComponents.push(<span key={`${textKey}-${textComponents.length}`}>{plainTextItem}</span>);

        // 处理文本换行，替换成<br />
        if(isPlainTextHasBreak && plainTextArray.length > index + 1) {
          textComponents.push(<br key={`${textKey}-${textComponents.length}`} />);
        }
      });
    }
  }

  textIndex++;

  return textComponents;
}